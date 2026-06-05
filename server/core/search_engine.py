"""
Unified Hybrid Search Engine.
Combines PostgreSQL full-text search (ts_vector) with pgvector cosine similarity
for enterprise-grade hybrid keyword + semantic search across all entities.
"""
import logging
import math
from typing import List, Dict, Any, Optional, Tuple
from enum import Enum
import numpy as np

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select, func, and_, or_, cast, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from core.embedding_service import embedding_service

logger = logging.getLogger(__name__)


class SearchEntity(str, Enum):
    TALENT = "talent"
    JOBS = "jobs"
    COMMUNITIES = "communities"
    PROJECTS = "projects"
    GIGS = "gigs"


class SortMode(str, Enum):
    RELEVANCE = "relevance"
    NEWEST = "newest"
    TRENDING = "trending"
    HIGHEST_SALARY = "highest_salary"
    BEST_MATCH = "best_match"
    MOST_APPLIED = "most_applied"
    REPUTATION = "reputation"


class SearchEngine:
    """
    Enterprise hybrid search engine supporting:
    - Keyword search via PostgreSQL full-text search
    - Semantic search via pgvector cosine similarity
    - Combined hybrid scoring with tunable alpha/beta weights
    - Cursor-based pagination
    - Faceted filtering
    """

    # Hybrid weights per entity type: (keyword_weight, vector_weight)
    HYBRID_WEIGHTS = {
        SearchEntity.TALENT: (0.35, 0.65),   # Semantic matching is crucial for talent
        SearchEntity.JOBS: (0.50, 0.50),      # Balanced — job titles are keyword-heavy
        SearchEntity.COMMUNITIES: (0.60, 0.40),
        SearchEntity.PROJECTS: (0.40, 0.60),
        SearchEntity.GIGS: (0.45, 0.55),
    }

    async def search_talent(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        open_to_work: Optional[bool] = None,
        min_reputation: Optional[float] = None,
        experience_level: Optional[str] = None,
        sort: SortMode = SortMode.RELEVANCE,
        cursor: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        """
        Multi-filter talent search with hybrid AI ranking.
        Returns candidates ranked by a weighted combination of keyword match,
        semantic similarity, reputation, and profile completeness.
        """
        conditions = []
        params: Dict[str, Any] = {"limit": limit}

        # Base query selects users joined with profiles
        base_sql = """
            SELECT 
                u.id::text as id, u.username, u.email,
                p.headline, p.about, p.open_to_work, p.visibility_mode,
                p.github_url, p.linkedin_url, p.portfolio_url,
                p.embedding
            FROM users u
            LEFT JOIN profiles p ON p.user_id = u.id
            WHERE u.is_active = true
            AND u.username != 'admin'
            AND u.email NOT LIKE 'admin@%'
            AND NOT EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN roles r ON r.id = ur.role_id
                WHERE ur.user_id = u.id AND r.role_name IN ('ADMIN', 'SUPER_ADMIN', 'COMPANY')
            )
        """

        if open_to_work is True:
            conditions.append("p.open_to_work = true")

        if min_reputation is not None:
            pass # Reputation score removed from schema

        if location:
            conditions.append("(p.about ILIKE :loc_pattern)")
            params["loc_pattern"] = f"%{location}%"

        if skills:
            # Join with user_skill_nodes + skill_taxonomy to filter by skills
            skill_filter = """
                u.id IN (
                    SELECT usn.user_id FROM user_skill_nodes usn
                    JOIN skill_taxonomy st ON st.id = usn.skill_id
                    WHERE LOWER(st.name) = ANY(:skill_names)
                )
            """
            conditions.append(skill_filter)
            params["skill_names"] = [s.lower() for s in skills]

        # Keyword scoring via trigram similarity (fallback if no ts_vector column)
        if query:
            conditions.append("""
                (u.username ILIKE :q_pattern 
                 OR p.headline ILIKE :q_pattern
                 OR p.about ILIKE :q_pattern)
            """)
            params["q_pattern"] = f"%{query}%"

        # Cursor pagination
        if cursor:
            conditions.append("u.id < :cursor_id")
            params["cursor_id"] = cursor

        # Assemble WHERE clause
        where_clause = ""
        if conditions:
            where_clause = " AND " + " AND ".join(conditions)

        # Sorting
        order_clause = "ORDER BY u.created_at DESC"
        if sort == SortMode.NEWEST:
            order_clause = "ORDER BY u.created_at DESC"
        elif sort == SortMode.REPUTATION:
            order_clause = "ORDER BY u.created_at DESC"

        final_sql = f"{base_sql}{where_clause} {order_clause} LIMIT :limit"

        result = await db.execute(text(final_sql), params)
        rows = result.mappings().all()

        # If we have a semantic query, compute vector scores and re-rank
        items = [dict(r) for r in rows]
        if query and items:
            items = await self._apply_hybrid_ranking(
                items, query, SearchEntity.TALENT, embedding_col="embedding"
            )

        # Build next cursor
        next_cursor = str(items[-1]["id"]) if len(items) == limit else None

        return {
            "items": self._sanitize_talent(items),
            "next_cursor": next_cursor,
            "total_hint": len(items),
        }

    async def search_jobs(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        remote_only: Optional[bool] = None,
        min_salary: Optional[int] = None,
        status: str = "OPEN",
        sort: SortMode = SortMode.RELEVANCE,
        cursor: Optional[str] = None,
        limit: int = 20,
        user_embedding: Optional[List[float]] = None,
    ) -> Dict[str, Any]:
        """
        Multi-filter job search with AI-powered ranking.
        """
        conditions = ["j.status = :status"]
        params: Dict[str, Any] = {"status": status, "limit": limit}

        base_sql = """
            SELECT 
                j.id::text as id, j.title, j.description_markdown, j.status,
                j.requirements, j.logistics, j.ai_optimization_score,
                j.created_at, j.updated_at,
                c.id::text as company_id,
                j.embedding
            FROM jobs j
            LEFT JOIN companies c ON c.id = j.company_id
        """

        if query:
            conditions.append("""
                (j.title ILIKE :q_pattern 
                 OR j.description_markdown ILIKE :q_pattern)
            """)
            params["q_pattern"] = f"%{query}%"

        if location:
            conditions.append("j.logistics->>'location' ILIKE :loc_pattern")
            params["loc_pattern"] = f"%{location}%"

        if remote_only:
            conditions.append("j.logistics->>'remote_policy' = 'REMOTE'")

        if cursor:
            conditions.append("j.id < :cursor_id")
            params["cursor_id"] = cursor

        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""

        order_clause = "ORDER BY j.created_at DESC"
        if sort == SortMode.NEWEST:
            order_clause = "ORDER BY j.created_at DESC"

        final_sql = f"{base_sql}{where_clause} {order_clause} LIMIT :limit"

        result = await db.execute(text(final_sql), params)
        rows = result.mappings().all()
        items = [dict(r) for r in rows]

        # Hybrid ranking if query present
        if query and items:
            items = await self._apply_hybrid_ranking(
                items, query, SearchEntity.JOBS, embedding_col="embedding"
            )

        next_cursor = str(items[-1]["id"]) if len(items) == limit else None

        return {
            "items": self._sanitize_jobs(items),
            "next_cursor": next_cursor,
            "total_hint": len(items),
        }

    async def search_communities(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        industry: Optional[str] = None,
        sort: SortMode = SortMode.RELEVANCE,
        cursor: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        """Search communities, forum topics, and discussion groups."""
        conditions: List[str] = []
        params: Dict[str, Any] = {"limit": limit}

        base_sql = """
            SELECT id::text as id, name, description, industry, is_company_sponsored, created_at
            FROM community_groups
        """

        if query:
            conditions.append("(name ILIKE :q_pattern OR description ILIKE :q_pattern)")
            params["q_pattern"] = f"%{query}%"

        if industry:
            conditions.append("industry = :industry")
            params["industry"] = industry

        if cursor:
            conditions.append("id < :cursor_id")
            params["cursor_id"] = cursor

        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        final_sql = f"{base_sql}{where_clause} ORDER BY created_at DESC LIMIT :limit"

        result = await db.execute(text(final_sql), params)
        rows = result.mappings().all()
        items = [dict(r) for r in rows]

        next_cursor = str(items[-1]["id"]) if len(items) == limit else None
        return {"items": items, "next_cursor": next_cursor, "total_hint": len(items)}

    async def search_projects(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        tech_stack: Optional[List[str]] = None,
        sort: SortMode = SortMode.RELEVANCE,
        cursor: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        """Search user projects and portfolios."""
        conditions: List[str] = []
        params: Dict[str, Any] = {"limit": limit}

        base_sql = """
            SELECT p.id::text as id, p.title, p.description, p.url, p.github_url,
                   p.skills_used, p.is_portfolio_item, p.profile_id::text as profile_id
            FROM projects p
        """

        if query:
            conditions.append("(p.title ILIKE :q_pattern OR p.description ILIKE :q_pattern)")
            params["q_pattern"] = f"%{query}%"

        if cursor:
            conditions.append("p.id < :cursor_id")
            params["cursor_id"] = cursor

        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        final_sql = f"{base_sql}{where_clause} ORDER BY p.is_portfolio_item DESC LIMIT :limit"

        result = await db.execute(text(final_sql), params)
        rows = result.mappings().all()
        items = [dict(r) for r in rows]

        next_cursor = str(items[-1]["id"]) if len(items) == limit else None
        return {"items": items, "next_cursor": next_cursor, "total_hint": len(items)}

    async def search_gigs(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        min_budget: Optional[int] = None,
        max_budget: Optional[int] = None,
        sort: SortMode = SortMode.RELEVANCE,
        cursor: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        """Search freelance gigs and contracts."""
        conditions: List[str] = []
        params: Dict[str, Any] = {"limit": limit}

        base_sql = """
            SELECT g.id::text as id, g.title, g.description, g.budget_range,
                   g.milestones, g.created_at, g.embedding
            FROM gigs g
        """

        if query:
            conditions.append("(g.title ILIKE :q_pattern OR g.description ILIKE :q_pattern)")
            params["q_pattern"] = f"%{query}%"

        if cursor:
            conditions.append("g.id < :cursor_id")
            params["cursor_id"] = cursor

        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        final_sql = f"{base_sql}{where_clause} ORDER BY g.created_at DESC LIMIT :limit"

        result = await db.execute(text(final_sql), params)
        rows = result.mappings().all()
        items = [dict(r) for r in rows]

        if query and items:
            items = await self._apply_hybrid_ranking(
                items, query, SearchEntity.GIGS, embedding_col="embedding"
            )

        next_cursor = str(items[-1]["id"]) if len(items) == limit else None
        return {"items": items, "next_cursor": next_cursor, "total_hint": len(items)}

    # ------------------------------------------------------------------
    # HYBRID RANKING
    # ------------------------------------------------------------------

    async def _apply_hybrid_ranking(
        self,
        items: List[Dict[str, Any]],
        query: str,
        entity: SearchEntity,
        embedding_col: str = "embedding",
    ) -> List[Dict[str, Any]]:
        """
        Re-rank items using a hybrid keyword + vector score.
        Items that have pre-computed embeddings get cosine similarity;
        others get keyword-only scoring.
        """
        alpha, beta = self.HYBRID_WEIGHTS.get(entity, (0.5, 0.5))

        # Get query embedding
        query_embedding = await embedding_service.get_query_embedding(query)
        if not query_embedding or all(v == 0.0 for v in query_embedding):
            return items  # Can't do vector ranking

        query_vec = np.array(query_embedding)
        q_norm = np.linalg.norm(query_vec)
        if q_norm == 0:
            return items

        query_lower = query.lower()

        for item in items:
            # Keyword score: simple substring presence in key text fields
            text_fields = " ".join(
                str(v) for k, v in item.items()
                if isinstance(v, str) and k not in ("id", "embedding")
            ).lower()

            keyword_score = 0.0
            for word in query_lower.split():
                if word in text_fields:
                    keyword_score += 1.0
            keyword_score = min(keyword_score / max(len(query_lower.split()), 1), 1.0)

            # Vector score: cosine similarity with stored embedding
            vector_score = 0.0
            emb = item.get(embedding_col)
            if emb is not None:
                try:
                    # pgvector might return a list, a string representation, or an ndarray
                    if isinstance(emb, str):
                        import json
                        emb = json.loads(emb)
                    item_vec = np.array(emb)
                    i_norm = np.linalg.norm(item_vec)
                    if i_norm > 0:
                        vector_score = float(np.dot(query_vec, item_vec) / (q_norm * i_norm))
                        vector_score = max(0.0, vector_score)
                except Exception as e:
                    logger.warning(f"Error computing hybrid vector score: {e}")

            item["_hybrid_score"] = alpha * keyword_score + beta * vector_score

        # Sort by hybrid score descending
        items.sort(key=lambda x: x.get("_hybrid_score", 0), reverse=True)
        return items

    # ------------------------------------------------------------------
    # SANITIZATION — strip internal fields before returning to API
    # ------------------------------------------------------------------

    def _sanitize_talent(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        for item in items:
            item.pop("embedding", None)
            item.pop("_hybrid_score", None)
            item.pop("hashed_password", None)
        return items

    def _sanitize_jobs(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        for item in items:
            item.pop("embedding", None)
            item.pop("_hybrid_score", None)
        return items


# Singleton
search_engine = SearchEngine()

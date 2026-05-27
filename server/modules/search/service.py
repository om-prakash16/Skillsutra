"""
Enterprise Search Service — orchestrates SearchEngine, RankingEngine,
RecommendationEngine, and AutocompleteEngine into a unified API layer.
"""
import logging
from typing import List, Dict, Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from core.search_engine import search_engine, SearchEntity, SortMode
from core.ranking import ranking_engine
from core.recommendations import recommendation_engine
from core.autocomplete import autocomplete_engine

logger = logging.getLogger(__name__)


class SearchService:
    """
    Unified search service that powers all /search/* endpoints.
    Delegates to the appropriate engine based on entity type.
    """

    # ──────────────────────────────────────────────
    # TALENT SEARCH
    # ──────────────────────────────────────────────

    async def search_talent(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        open_to_work: Optional[bool] = None,
        min_reputation: Optional[float] = None,
        experience_level: Optional[str] = None,
        sort: str = "relevance",
        cursor: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        sort_mode = SortMode(sort) if sort in SortMode.__members__.values() else SortMode.RELEVANCE

        result = await search_engine.search_talent(
            db=db,
            query=query,
            skills=skills,
            location=location,
            open_to_work=open_to_work,
            min_reputation=min_reputation,
            experience_level=experience_level,
            sort=sort_mode,
            cursor=cursor,
            limit=limit,
        )

        # Apply multi-signal ranking
        if result["items"]:
            result["items"] = ranking_engine.rank_talent(result["items"])

        return result

    # ──────────────────────────────────────────────
    # JOB SEARCH
    # ──────────────────────────────────────────────

    async def search_jobs(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        remote_only: Optional[bool] = None,
        min_salary: Optional[int] = None,
        sort: str = "relevance",
        cursor: Optional[str] = None,
        limit: int = 20,
        user_prefs: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        sort_mode = SortMode(sort) if sort in SortMode.__members__.values() else SortMode.RELEVANCE

        result = await search_engine.search_jobs(
            db=db,
            query=query,
            skills=skills,
            location=location,
            remote_only=remote_only,
            min_salary=min_salary,
            sort=sort_mode,
            cursor=cursor,
            limit=limit,
        )

        if result["items"]:
            result["items"] = ranking_engine.rank_jobs(result["items"], user_prefs)

        return result

    # ──────────────────────────────────────────────
    # COMMUNITY SEARCH
    # ──────────────────────────────────────────────

    async def search_communities(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        industry: Optional[str] = None,
        sort: str = "relevance",
        cursor: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        sort_mode = SortMode(sort) if sort in SortMode.__members__.values() else SortMode.RELEVANCE
        return await search_engine.search_communities(
            db=db, query=query, industry=industry, sort=sort_mode, cursor=cursor, limit=limit,
        )

    # ──────────────────────────────────────────────
    # PROJECT SEARCH
    # ──────────────────────────────────────────────

    async def search_projects(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        tech_stack: Optional[List[str]] = None,
        sort: str = "relevance",
        cursor: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        sort_mode = SortMode(sort) if sort in SortMode.__members__.values() else SortMode.RELEVANCE
        return await search_engine.search_projects(
            db=db, query=query, tech_stack=tech_stack, sort=sort_mode, cursor=cursor, limit=limit,
        )

    # ──────────────────────────────────────────────
    # GIG SEARCH
    # ──────────────────────────────────────────────

    async def search_gigs(
        self,
        db: AsyncSession,
        query: Optional[str] = None,
        min_budget: Optional[int] = None,
        max_budget: Optional[int] = None,
        sort: str = "relevance",
        cursor: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        sort_mode = SortMode(sort) if sort in SortMode.__members__.values() else SortMode.RELEVANCE
        return await search_engine.search_gigs(
            db=db, query=query, min_budget=min_budget, max_budget=max_budget,
            sort=sort_mode, cursor=cursor, limit=limit,
        )

    # ──────────────────────────────────────────────
    # AUTOCOMPLETE
    # ──────────────────────────────────────────────

    async def autocomplete(
        self,
        prefix: str,
        entity_types: Optional[List[str]] = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        return await autocomplete_engine.suggest(prefix, entity_types, limit)

    # ──────────────────────────────────────────────
    # TRENDING
    # ──────────────────────────────────────────────

    async def get_trending(
        self,
        db: AsyncSession,
        entity_type: str = "posts",
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Fetch trending entities using time-decay scoring."""
        if entity_type == "posts":
            sql = """
                SELECT id, content_markdown, likes_count, comments_count,
                       reposts_count, created_at, author_id
                FROM posts
                WHERE deleted_at IS NULL
                ORDER BY created_at DESC
                LIMIT 100
            """
            from sqlalchemy import text
            result = await db.execute(text(sql))
            items = [dict(r) for r in result.mappings().all()]
            return ranking_engine.rank_trending(items, interaction_key="likes_count")[:limit]

        elif entity_type == "jobs":
            sql = """
                SELECT j.id, j.title, j.created_at,
                       COUNT(a.id) as applicant_count
                FROM jobs j
                LEFT JOIN applications a ON a.job_id = j.id
                WHERE j.status = 'OPEN'
                GROUP BY j.id
                ORDER BY j.created_at DESC
                LIMIT 100
            """
            from sqlalchemy import text
            result = await db.execute(text(sql))
            items = [dict(r) for r in result.mappings().all()]
            return ranking_engine.rank_trending(items, interaction_key="applicant_count")[:limit]

        elif entity_type == "skills":
            sql = """
                SELECT st.id, st.name, st.category, COUNT(usn.id) as user_count,
                       MAX(usn.created_at) as created_at
                FROM skill_taxonomy st
                LEFT JOIN user_skill_nodes usn ON usn.skill_id = st.id
                GROUP BY st.id
                ORDER BY user_count DESC
                LIMIT 50
            """
            from sqlalchemy import text
            result = await db.execute(text(sql))
            items = [dict(r) for r in result.mappings().all()]
            return ranking_engine.rank_trending(items, interaction_key="user_count")[:limit]

        return []

    # ──────────────────────────────────────────────
    # RECOMMENDATIONS
    # ──────────────────────────────────────────────

    async def get_recommendations(
        self,
        db: AsyncSession,
        user_id: str,
        entity_type: str = "jobs",
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        if entity_type == "jobs":
            return await recommendation_engine.recommend_jobs(db, user_id, limit)
        elif entity_type == "people":
            return await recommendation_engine.recommend_people(db, user_id, limit)
        elif entity_type == "gigs":
            return await recommendation_engine.recommend_gigs(db, user_id, limit)
        elif entity_type == "communities":
            return await recommendation_engine.recommend_communities(db, user_id, limit)
        return []

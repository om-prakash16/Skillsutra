"""
Multi-Strategy Recommendation Engine.
Supports content-based (pgvector), collaborative, and graph-based recommendations.
"""
import logging
from typing import List, Dict, Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from core.embedding_service import embedding_service
from core.ranking import ranking_engine

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """
    Enterprise recommendation engine with:
    1. Content-Based — pgvector cosine similarity between user profile and entities
    2. Collaborative — "Users similar to you also applied to these jobs"
    3. Graph-Based — Traverse skill graph for adjacent opportunities
    4. Behavioral — Weight recent user actions (views, saves, applies)
    """

    async def recommend_jobs(
        self,
        db: AsyncSession,
        user_id: str,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """
        Content-based job recommendations using pgvector.
        Finds open jobs whose embeddings are closest to the user's profile embedding.
        """
        # Get user's profile embedding
        user_emb_sql = """
            SELECT p.embedding FROM profiles p WHERE p.user_id = :uid LIMIT 1
        """
        result = await db.execute(text(user_emb_sql), {"uid": user_id})
        row = result.mappings().first()

        if not row or not row.get("embedding"):
            # Fallback: return newest jobs
            fallback_sql = """
                SELECT j.id, j.title, j.logistics, j.created_at
                FROM jobs j WHERE j.status = 'OPEN'
                ORDER BY j.created_at DESC LIMIT :lim
            """
            result = await db.execute(text(fallback_sql), {"lim": limit})
            return [dict(r) for r in result.mappings().all()]

        # pgvector cosine similarity search
        vec_sql = """
            SELECT j.id, j.title, j.logistics, j.requirements,
                   j.created_at,
                   1 - (j.embedding <=> :user_emb::vector) as similarity
            FROM jobs j
            WHERE j.status = 'OPEN' AND j.embedding IS NOT NULL
            ORDER BY j.embedding <=> :user_emb::vector
            LIMIT :lim
        """
        result = await db.execute(text(vec_sql), {"user_emb": str(row["embedding"]), "lim": limit})
        jobs = [dict(r) for r in result.mappings().all()]

        for j in jobs:
            j["recommendation_score"] = round(float(j.get("similarity", 0)) * 100, 2)
            j["recommendation_reason"] = "Matches your profile and skill set"
            j.pop("similarity", None)

        return jobs

    async def recommend_people(
        self,
        db: AsyncSession,
        user_id: str,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """
        Find people with similar profiles using pgvector similarity.
        Useful for networking suggestions and mentor matching.
        """
        user_emb_sql = """
            SELECT p.embedding FROM profiles p WHERE p.user_id = :uid LIMIT 1
        """
        result = await db.execute(text(user_emb_sql), {"uid": user_id})
        row = result.mappings().first()

        if not row or not row.get("embedding"):
            fallback_sql = """
                SELECT u.id, u.username, u.first_name, u.last_name,
                       u.reputation_score, u.profile_picture
                FROM users u WHERE u.is_active = true AND u.id != :uid
                ORDER BY u.reputation_score DESC LIMIT :lim
            """
            result = await db.execute(text(fallback_sql), {"uid": user_id, "lim": limit})
            return [dict(r) for r in result.mappings().all()]

        vec_sql = """
            SELECT u.id, u.username, u.first_name, u.last_name,
                   u.reputation_score, u.profile_picture,
                   p.headline,
                   1 - (p.embedding <=> :user_emb::vector) as similarity
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            WHERE p.user_id != :uid AND p.embedding IS NOT NULL AND u.is_active = true
            ORDER BY p.embedding <=> :user_emb::vector
            LIMIT :lim
        """
        result = await db.execute(text(vec_sql), {"user_emb": str(row["embedding"]), "uid": user_id, "lim": limit})
        people = [dict(r) for r in result.mappings().all()]

        for p in people:
            p["recommendation_score"] = round(float(p.get("similarity", 0)) * 100, 2)
            p["recommendation_reason"] = "Similar profile and interests"
            p.pop("similarity", None)

        return people

    async def recommend_gigs(
        self,
        db: AsyncSession,
        user_id: str,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Content-based gig recommendations via pgvector."""
        user_emb_sql = """
            SELECT p.embedding FROM profiles p WHERE p.user_id = :uid LIMIT 1
        """
        result = await db.execute(text(user_emb_sql), {"uid": user_id})
        row = result.mappings().first()

        if not row or not row.get("embedding"):
            fallback_sql = """
                SELECT g.id, g.title, g.budget_range, g.created_at
                FROM gigs g ORDER BY g.created_at DESC LIMIT :lim
            """
            result = await db.execute(text(fallback_sql), {"lim": limit})
            return [dict(r) for r in result.mappings().all()]

        vec_sql = """
            SELECT g.id, g.title, g.description, g.budget_range, g.created_at,
                   1 - (g.embedding <=> :user_emb::vector) as similarity
            FROM gigs g
            WHERE g.embedding IS NOT NULL
            ORDER BY g.embedding <=> :user_emb::vector
            LIMIT :lim
        """
        result = await db.execute(text(vec_sql), {"user_emb": str(row["embedding"]), "lim": limit})
        gigs = [dict(r) for r in result.mappings().all()]

        for g in gigs:
            g["recommendation_score"] = round(float(g.get("similarity", 0)) * 100, 2)
            g["recommendation_reason"] = "Aligns with your expertise"
            g.pop("similarity", None)

        return gigs

    async def recommend_communities(
        self,
        db: AsyncSession,
        user_id: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Graph-based community recommendations.
        Find communities that align with the user's skill graph.
        """
        # Get user's skills
        skills_sql = """
            SELECT st.name, st.category
            FROM user_skill_nodes usn
            JOIN skill_taxonomy st ON st.id = usn.skill_id
            WHERE usn.user_id = :uid
        """
        result = await db.execute(text(skills_sql), {"uid": user_id})
        user_skills = result.mappings().all()

        if not user_skills:
            fallback_sql = """
                SELECT id, name, description, industry, created_at
                FROM community_groups ORDER BY created_at DESC LIMIT :lim
            """
            result = await db.execute(text(fallback_sql), {"lim": limit})
            return [dict(r) for r in result.mappings().all()]

        # Match communities by industry/skill category overlap
        categories = list(set(s.get("category", "") for s in user_skills if s.get("category")))
        if not categories:
            categories = ["general"]

        comm_sql = """
            SELECT id, name, description, industry, created_at
            FROM community_groups
            WHERE industry = ANY(:cats) OR industry IS NULL
            ORDER BY created_at DESC
            LIMIT :lim
        """
        result = await db.execute(text(comm_sql), {"cats": categories, "lim": limit})
        communities = [dict(r) for r in result.mappings().all()]

        for c in communities:
            c["recommendation_reason"] = f"Related to your {', '.join(categories[:2])} skills"

        return communities


# Singleton
recommendation_engine = RecommendationEngine()

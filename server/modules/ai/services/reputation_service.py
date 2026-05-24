import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from core.db import get_db
from core.cache import cache_result
from modules.ai.services.github_service import github_scanner

logger = logging.getLogger(__name__)

class ReputationScoringService:
    @cache_result(ttl=300) # Cache scores for 5 minutes
    async def get_composite_score(self, user_id: str) -> Dict[str, Any]:
        """
        Calculates and returns the composite developer reputation score for a user.
        Weighs projects, github PRs/commits, coding challenges solved, and hackathons.
        """
        db = get_db()
        if not db:
            logger.warning(f"Database unavailable for scoring user {user_id}. Returning partial results.")
            return self._get_empty_score(user_id)

        # 1. Fetch sub-scores in parallel
        try:
            scores = await asyncio.gather(
                self._calc_skills_score(db, user_id),
                self._calc_project_score(db, user_id),
                self._calc_github_score(db, user_id),
                self._calc_hackathons_score(db, user_id),
                self._calc_challenges_score(db, user_id)
            )
        except Exception as e:
            logger.error(f"Error calculating sub-scores for {user_id}: {e}", exc_info=True)
            return self._get_empty_score(user_id)
            
        skills_score, project_score, github_score, hack_score, challenge_score = scores

        # 2. Apply weights (Production Configurable)
        weights = {
            "skills": 0.25,
            "projects": 0.20,
            "github": 0.25,
            "hackathons": 0.15,
            "challenges": 0.15,
        }

        total = (
            skills_score * weights["skills"]
            + project_score * weights["projects"]
            + github_score * weights["github"]
            + hack_score * weights["hackathons"]
            + challenge_score * weights["challenges"]
        ) * 10  # Scale to 0-1000

        total_score = min(int(total), 1000)
        level = self._determine_level(total_score)

        # 3. Persist and Log
        await self._persist_score(db, user_id, total_score, scores, weights)

        return {
            "user_id": user_id,
            "total_score": total_score,
            "max_score": 1000,
            "level": level,
            "breakdown": {
                "skills_score": skills_score,
                "project_score": project_score,
                "github_score": github_score,
                "hackathons_score": hack_score,
                "challenges_score": challenge_score,
            },
            "weights": weights,
            "updated_at": datetime.utcnow().isoformat()
        }

    def _determine_level(self, score: int) -> str:
        if score >= 800: return "Master"
        if score >= 600: return "Expert"
        if score >= 400: return "Intermediate"
        if score >= 200: return "Junior"
        return "Beginner"

    async def _calc_skills_score(self, db, user_id: str) -> float:
        """Aggregate score from passed skill quizzes."""
        try:
            res = db.table("skill_quizzes").select("score").eq("user_id", user_id).eq("passed", True).execute()
            if not res.data:
                # Fallback to check by candidate_wallet/id
                res = db.table("skill_quizzes").select("score").eq("candidate_wallet", user_id).eq("passed", True).execute()
                if not res.data:
                    return 50.0 # Default starting skills baseline
            return min(sum(q["score"] for q in res.data) / len(res.data), 100.0)
        except Exception as e:
            logger.error(f"Skills score calculation failed for {user_id}: {e}")
            return 50.0

    async def _calc_project_score(self, db, user_id: str) -> float:
        """Aggregate score from project evaluations."""
        try:
            res = db.table("projects").select("id").eq("user_id", user_id).execute()
            if not res.data:
                return 40.0 # Baseline
            # 20 points per project, up to 100
            return min(len(res.data) * 20.0, 100.0)
        except Exception as e:
            logger.error(f"Project score calculation failed for {user_id}: {e}")
            return 40.0

    async def _calc_github_score(self, db, user_id: str) -> float:
        """GitHub activity metrics (PRs + Commits)."""
        try:
            res = db.table("github_contributions").select("pull_requests, commits").eq("user_id", user_id).single().execute()
            if res.data:
                prs = res.data.get("pull_requests", 0)
                commits = res.data.get("commits", 0)
                return min(100.0, (prs * 8.0) + (commits * 0.15))
            return 30.0 # Baseline
        except Exception as e:
            logger.error(f"GitHub score calculation failed for {user_id}: {e}")
            return 30.0

    async def _calc_hackathons_score(self, db, user_id: str) -> float:
        """Score based on active hackathons/competitions joined."""
        try:
            res = db.table("team_members").select("team_id").eq("user_id", user_id).eq("status", "accepted").execute()
            if not res.data:
                return 0.0
            # 25 points per hackathon team, up to 100
            return min(len(res.data) * 25.0, 100.0)
        except Exception as e:
            logger.error(f"Hackathons score calculation failed for {user_id}: {e}")
            return 0.0

    async def _calc_challenges_score(self, db, user_id: str) -> float:
        """Score based on coding challenges passed in the Arena."""
        try:
            res = db.table("challenge_attempts").select("id").eq("user_id", user_id).eq("status", "passed").execute()
            if not res.data:
                return 0.0
            # 20 points per passed challenge, up to 100
            return min(len(res.data) * 20.0, 100.0)
        except Exception as e:
            logger.error(f"Challenges score calculation failed for {user_id}: {e}")
            return 0.0

    async def _persist_score(self, db, user_id: str, total: int, sub_scores: List[float], weights: Dict[str, float]):
        """Asynchronously save score to history and update user record."""
        try:
            # Update user profile
            db.table("users").update({"reputation_score": total}).eq("id", user_id).execute()
            
            # Record in history
            db.table("reputation_history").insert({
                "user_id": user_id,
                "total_score": total,
                "skills_score": sub_scores[0],
                "project_score": sub_scores[1],
                "github_score": sub_scores[2],
                "job_score": sub_scores[3], # Map hackathons
                "web3_score": sub_scores[4], # Map challenges
                "recorded_at": datetime.utcnow().isoformat()
            }).execute()
        except Exception as e:
            logger.error(f"Failed to persist reputation for {user_id}: {e}")

    def _get_empty_score(self, user_id: str) -> Dict[str, Any]:
        return {
            "user_id": user_id,
            "total_score": 0,
            "level": "Beginner",
            "breakdown": {k: 0.0 for k in ["skills_score", "project_score", "github_score", "hackathons_score", "challenges_score"]},
            "error": "Scoring engine partially unavailable"
        }

reputation_service = ReputationScoringService()

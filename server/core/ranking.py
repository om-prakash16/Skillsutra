"""
Enterprise Multi-Signal Ranking & Scoring Engine.
Provides weighted, explainable ranking for all platform entities.
Implements trending detection with time-decay functions.
"""
import math
import time
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


def _hours_since(dt) -> float:
    """Calculate hours elapsed since a datetime."""
    if dt is None:
        return 8760  # Default to 1 year ago
    if isinstance(dt, str):
        try:
            dt = datetime.fromisoformat(dt.replace("Z", "+00:00"))
        except Exception:
            return 8760
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    delta = (now - dt).total_seconds() / 3600
    return max(delta, 0.01)


def _time_decay(hours: float, half_life_hours: float = 72) -> float:
    """Exponential time decay: score halves every `half_life_hours`."""
    return math.exp(-0.693 * hours / half_life_hours)


class RankingEngine:
    """
    Enterprise ranking engine with:
    - Configurable weighted multi-signal scoring
    - Time-decay based trending detection
    - Profile completeness heuristics
    - Explainable score breakdowns
    """

    # ──────────────────────────────────────────────
    # TALENT RANKING
    # ──────────────────────────────────────────────

    TALENT_WEIGHTS = {
        "vector_match": 0.30,
        "keyword_match": 0.15,
        "reputation": 0.15,
        "xp_level": 0.10,
        "profile_completeness": 0.10,
        "challenge_performance": 0.10,
        "recency": 0.05,
        "endorsements": 0.05,
    }

    def rank_talent(
        self,
        candidates: List[Dict[str, Any]],
        query_context: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Rank talent using weighted multi-signal scoring.
        Each candidate dict should contain raw signal values.
        """
        for c in candidates:
            signals = {}

            # Vector match (0-1, pre-computed by search engine)
            signals["vector_match"] = min(c.get("_hybrid_score", 0), 1.0)

            # Keyword match (0-1, pre-computed)
            signals["keyword_match"] = min(c.get("_keyword_score", 0), 1.0)

            # Reputation (normalize 0-100 to 0-1)
            rep = c.get("reputation_score", 0) or 0
            signals["reputation"] = min(float(rep) / 100.0, 1.0)

            # XP / Level (normalize level 1-50 to 0-1)
            xp = c.get("xp_points", 0) or 0
            level = c.get("current_level", 1) or 1
            signals["xp_level"] = min(float(level) / 50.0, 1.0)

            # Profile completeness
            signals["profile_completeness"] = self._profile_completeness(c)

            # Challenge performance (normalize 0-100)
            challenge = c.get("challenge_avg_score", 0) or 0
            signals["challenge_performance"] = min(float(challenge) / 100.0, 1.0)

            # Recency (time decay on last activity)
            hours = _hours_since(c.get("updated_at") or c.get("created_at"))
            signals["recency"] = _time_decay(hours, half_life_hours=168)  # 1-week half-life

            # Endorsements (normalize 0-50)
            endorsements = c.get("endorsement_count", 0) or 0
            signals["endorsements"] = min(float(endorsements) / 50.0, 1.0)

            # Weighted sum
            final_score = sum(
                self.TALENT_WEIGHTS[k] * signals[k] for k in self.TALENT_WEIGHTS
            )

            c["ranking_score"] = round(final_score * 100, 2)
            c["ranking_signals"] = {k: round(v, 3) for k, v in signals.items()}

        candidates.sort(key=lambda x: x.get("ranking_score", 0), reverse=True)
        return candidates

    # ──────────────────────────────────────────────
    # JOB RANKING
    # ──────────────────────────────────────────────

    JOB_WEIGHTS = {
        "ai_match": 0.35,
        "freshness": 0.20,
        "engagement": 0.15,
        "salary_fit": 0.10,
        "company_reputation": 0.10,
        "remote_match": 0.10,
    }

    def rank_jobs(
        self,
        jobs: List[Dict[str, Any]],
        user_prefs: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """Rank jobs using weighted scoring personalized to user preferences."""
        prefs = user_prefs or {}

        for j in jobs:
            signals = {}

            # AI match (0-1)
            signals["ai_match"] = min(j.get("_hybrid_score", 0), 1.0)

            # Freshness
            hours = _hours_since(j.get("created_at"))
            signals["freshness"] = _time_decay(hours, half_life_hours=72)

            # Engagement (application count, normalize 0-100)
            apps = j.get("applicant_count", 0) or 0
            signals["engagement"] = min(float(apps) / 100.0, 1.0)

            # Salary fit (binary for now)
            signals["salary_fit"] = 0.5  # Neutral default

            # Company reputation (placeholder)
            signals["company_reputation"] = 0.5

            # Remote match
            remote_pref = prefs.get("remote_preference", None)
            job_remote = (j.get("logistics") or {}).get("remote_policy", "")
            if remote_pref and job_remote:
                signals["remote_match"] = 1.0 if remote_pref.upper() == job_remote.upper() else 0.3
            else:
                signals["remote_match"] = 0.5

            final_score = sum(self.JOB_WEIGHTS[k] * signals[k] for k in self.JOB_WEIGHTS)

            j["ranking_score"] = round(final_score * 100, 2)
            j["ranking_signals"] = {k: round(v, 3) for k, v in signals.items()}

        jobs.sort(key=lambda x: x.get("ranking_score", 0), reverse=True)
        return jobs

    # ──────────────────────────────────────────────
    # TRENDING ALGORITHM
    # ──────────────────────────────────────────────

    def compute_trending_score(
        self,
        interactions_recent: int,
        hours_since_creation: float,
        time_window_hours: float = 24,
        decay_lambda: float = 0.05,
    ) -> float:
        """
        Trending score = (interactions / time_window) * decay_factor.
        Higher for items with many recent interactions that are still fresh.
        """
        if time_window_hours <= 0:
            time_window_hours = 1
        velocity = interactions_recent / time_window_hours
        decay = math.exp(-decay_lambda * hours_since_creation)
        return round(velocity * decay, 4)

    def rank_trending(
        self, items: List[Dict[str, Any]], interaction_key: str = "likes_count"
    ) -> List[Dict[str, Any]]:
        """Apply trending scores and sort by trend velocity."""
        for item in items:
            interactions = item.get(interaction_key, 0) or 0
            hours = _hours_since(item.get("created_at"))
            item["trending_score"] = self.compute_trending_score(interactions, hours)

        items.sort(key=lambda x: x.get("trending_score", 0), reverse=True)
        return items

    # ──────────────────────────────────────────────
    # HELPERS
    # ──────────────────────────────────────────────

    def _profile_completeness(self, user: Dict[str, Any]) -> float:
        """Heuristic 0-1 score for how complete a user's profile is."""
        fields = [
            "first_name", "last_name", "bio", "profile_picture",
            "headline", "about", "github_url", "linkedin_url",
        ]
        filled = sum(1 for f in fields if user.get(f))
        return min(float(filled) / len(fields), 1.0)


# Singleton
ranking_engine = RankingEngine()

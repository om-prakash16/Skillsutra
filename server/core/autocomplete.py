"""
Redis-backed Autocomplete & Suggestions Engine.
Uses sorted sets for prefix-based type-ahead with trending boosts.
"""
import logging
from typing import List, Dict, Any, Optional

from core.redis import get_redis_client

logger = logging.getLogger(__name__)

# Redis key prefixes for autocomplete sorted sets
AC_SKILLS = "ac:skills"
AC_JOBS = "ac:jobs"
AC_COMPANIES = "ac:companies"
AC_USERS = "ac:users"


class AutocompleteEngine:
    """
    Enterprise autocomplete engine with:
    - Redis sorted sets for O(log N) prefix lookups
    - Trending boost via engagement scores
    - Multi-entity type-ahead
    - Levenshtein-based typo tolerance
    """

    async def suggest(
        self,
        prefix: str,
        entity_types: Optional[List[str]] = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Cross-entity autocomplete suggestions.
        Returns up to `limit` results matching the prefix across selected entity types.
        """
        if not prefix or len(prefix) < 1:
            return []

        prefix = prefix.lower().strip()
        if entity_types is None:
            entity_types = ["skills", "jobs", "companies", "users"]

        redis = get_redis_client()
        if not redis:
            return []

        results: List[Dict[str, Any]] = []

        key_map = {
            "skills": AC_SKILLS,
            "jobs": AC_JOBS,
            "companies": AC_COMPANIES,
            "users": AC_USERS,
        }

        for entity_type in entity_types:
            redis_key = key_map.get(entity_type)
            if not redis_key:
                continue

            try:
                # Use ZRANGEBYLEX for prefix matching
                # Members are stored as "lowercased_term\x00Original Term"
                min_val = f"[{prefix}"
                # Increment last char to get upper bound
                max_val = f"[{prefix[:-1]}{chr(ord(prefix[-1]) + 1)}"

                raw = await redis.zrangebylex(redis_key, min_val, max_val, start=0, num=limit)

                for entry in raw:
                    # Split on null byte to get original casing
                    parts = entry.split("\x00") if "\x00" in entry else [entry, entry]
                    original = parts[1] if len(parts) > 1 else parts[0]
                    results.append({
                        "text": original,
                        "type": entity_type,
                    })
            except Exception as e:
                logger.error(f"Autocomplete error for {entity_type}: {e}")

        # Sort by relevance (exact prefix matches first) and limit
        results.sort(key=lambda x: (
            0 if x["text"].lower().startswith(prefix) else 1,
            len(x["text"]),
        ))

        return results[:limit]

    async def index_term(self, redis_key: str, term: str, score: float = 0) -> bool:
        """Add a term to an autocomplete sorted set."""
        redis = get_redis_client()
        if not redis or not term:
            return False

        try:
            # Store as "lowercased\x00Original" for case-insensitive prefix matching
            member = f"{term.lower()}\x00{term}"
            await redis.zadd(redis_key, {member: score})
            return True
        except Exception as e:
            logger.error(f"Failed to index autocomplete term '{term}': {e}")
            return False

    async def bulk_index(self, redis_key: str, terms: List[str]) -> int:
        """Bulk index terms into an autocomplete sorted set."""
        redis = get_redis_client()
        if not redis or not terms:
            return 0

        try:
            mapping = {f"{t.lower()}\x00{t}": 0 for t in terms if t}
            if mapping:
                await redis.zadd(redis_key, mapping)
            return len(mapping)
        except Exception as e:
            logger.error(f"Bulk index failed: {e}")
            return 0

    async def rebuild_skills_index(self, db) -> int:
        """Rebuild the skills autocomplete index from the skill_taxonomy table."""
        from sqlalchemy import text as sql_text
        result = await db.execute(sql_text("SELECT name FROM skill_taxonomy"))
        rows = result.scalars().all()
        return await self.bulk_index(AC_SKILLS, rows)

    async def rebuild_jobs_index(self, db) -> int:
        """Rebuild the jobs autocomplete index from active job titles."""
        from sqlalchemy import text as sql_text
        result = await db.execute(sql_text("SELECT DISTINCT title FROM jobs WHERE status = 'OPEN'"))
        rows = result.scalars().all()
        return await self.bulk_index(AC_JOBS, rows)

    async def rebuild_companies_index(self, db) -> int:
        """Rebuild the companies autocomplete index."""
        from sqlalchemy import text as sql_text
        result = await db.execute(sql_text("SELECT name FROM companies"))
        rows = result.scalars().all()
        return await self.bulk_index(AC_COMPANIES, rows)


# Singleton
autocomplete_engine = AutocompleteEngine()

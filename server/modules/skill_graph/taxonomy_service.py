"""
Taxonomy Service — Master skill dictionary CRUD and fuzzy search.
"""

from typing import Dict, Any, List, Optional
from core.supabase import get_supabase


class TaxonomyService:
    """Manages the skill_taxonomy table: CRUD, search, hierarchy."""

    def _get_db(self):
        return get_supabase()

    async def list_skills(
        self, category: Optional[str] = None, page: int = 1, page_size: int = 50
    ) -> Dict[str, Any]:
        db = self._get_db()
        if not db:
            return {"data": [], "total": 0}

        query = db.table("skill_taxonomy").select("*", count="exact")
        if category:
            query = query.eq("category", category)

        offset = (page - 1) * page_size
        query = query.order("popularity_score", desc=True).range(offset, offset + page_size - 1)
        res = query.execute()

        return {"data": res.data or [], "total": res.count or 0, "page": page, "page_size": page_size}

    async def search_skills(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        db = self._get_db()
        if not db:
            return []

        # Fuzzy search using ilike
        res = db.table("skill_taxonomy").select("id, name, slug, category, popularity_score").ilike(
            "name", f"%{query}%"
        ).order("popularity_score", desc=True).limit(limit).execute()

        return res.data or []

    async def get_skill(self, skill_id: str) -> Optional[Dict[str, Any]]:
        db = self._get_db()
        if not db:
            return None

        res = db.table("skill_taxonomy").select("*").eq("id", skill_id).single().execute()
        return res.data

    async def create_skill(self, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self._get_db()
        if not db:
            return {"error": "No database"}

        res = db.table("skill_taxonomy").insert(data).execute()
        return res.data[0] if res.data else {"error": "Insert failed"}

    async def update_skill(self, skill_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        db = self._get_db()
        if not db:
            return {"error": "No database"}

        data["updated_at"] = "now()"
        res = db.table("skill_taxonomy").update(data).eq("id", skill_id).execute()
        return res.data[0] if res.data else {"error": "Update failed"}

    async def delete_skill(self, skill_id: str) -> Dict[str, Any]:
        db = self._get_db()
        if not db:
            return {"error": "No database"}

        db.table("skill_taxonomy").delete().eq("id", skill_id).execute()
        return {"status": "deleted", "id": skill_id}

    async def get_children(self, parent_id: str) -> List[Dict[str, Any]]:
        db = self._get_db()
        if not db:
            return []

        res = db.table("skill_taxonomy").select("*").eq("parent_id", parent_id).order("name").execute()
        return res.data or []

    async def get_skill_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        db = self._get_db()
        if not db:
            return None

        res = db.table("skill_taxonomy").select("*").eq("slug", slug).single().execute()
        return res.data

from typing import List, Dict, Any
from core.supabase import get_supabase


class CMSService:
    @staticmethod
    async def get_all_active() -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db:
            return []
        response = db.table("site_content").select("*").eq("is_active", True).execute()
        return response.data if response.data else []

    @staticmethod
    async def get_by_section(section: str) -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db:
            return []
        response = (
            db.table("site_content")
            .select("*")
            .eq("section_key", section)
            .eq("is_active", True)
            .execute()
        )
        return response.data if response.data else []

    @staticmethod
    async def upsert_content(data: Dict[str, Any], updated_by: str) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database unavailable")

        # Upsert logic for CMS content
        response = (
            db.table("site_content")
            .upsert(
                {
                    "section_key": data.get("section_key"),
                    "content_key": data.get("content_key"),
                    "content_value": data.get("content_value"),
                    "metadata": data.get("metadata", {}),
                    "updated_at": "now()",
                    "updated_by": updated_by,
                },
                on_conflict="section_key, content_key",
            )
            .execute()
        )

        return response.data[0] if response.data else {}

    @staticmethod
    async def deactivate_key(section: str, key: str) -> bool:
        db = get_supabase()
        if not db:
            return False
        db.table("site_content").update({"is_active": False}).eq(
            "section_key", section
        ).eq("content_key", key).execute()
        return True

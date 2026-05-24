from typing import List, Dict, Any
from core.db import get_db

class SchemaService:
    @staticmethod
    async def get_all_fields() -> List[Dict[str, Any]]:
        """Fetch all defined profile fields."""
        db = get_db()
        res = db.table("profile_schema_fields").select("*").order("display_order").execute()
        return res.data

    @staticmethod
    async def upsert_field(field_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update a dynamic profile field."""
        db = get_db()
        res = db.table("profile_schema_fields").upsert(field_data).execute()
        return res.data[0] if res.data else {}

    @staticmethod
    async def delete_field(field_id: str):
        """Remove a field from the profile schema."""
        db = get_db()
        db.table("profile_schema_fields").delete().eq("id", field_id).execute()
        return {"status": "deleted"}

# Singleton
schema_service = SchemaService()

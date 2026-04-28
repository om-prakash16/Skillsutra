from portal.core.supabase import get_supabase
from typing import Dict, Any, List, Optional
import asyncio

class AdminRepository:
    def __init__(self):
        self.db = get_supabase()

    async def get_system_metrics(self) -> Dict[str, Any]:
        tasks = [
            self.db.table("users").select("id", count="exact").execute(),
            self.db.table("companies").select("id", count="exact").execute(),
            self.db.table("jobs").select("id", count="exact").execute(),
            self.db.table("applications").select("id", count="exact").execute(),
            self.db.table("activity_events").select("*").order("created_at", desc=True).limit(20).execute()
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return {
            "total_users": results[0].count if not isinstance(results[0], Exception) else 0,
            "total_companies": results[1].count if not isinstance(results[1], Exception) else 0,
            "total_jobs": results[2].count if not isinstance(results[2], Exception) else 0,
            "total_applications": results[3].count if not isinstance(results[3], Exception) else 0,
            "recent_activity": results[4].data if not isinstance(results[4], Exception) else []
        }

    def update_feature_flag(self, feature_name: str, enabled: bool):
        return self.db.table("feature_flags").update({"is_enabled": enabled}).eq("feature_name", feature_name).execute()

    def update_platform_setting(self, key: str, value: Any):
        return self.db.table("platform_settings").upsert({"setting_key": key, "setting_value": value}).execute()

    def get_all_settings(self):
        return self.db.table("platform_settings").select("*").execute()

    def log_moderation(self, data: Dict[str, Any]):
        return self.db.table("moderation_logs").insert(data).execute()

    def update_user_status(self, user_id: str, status: str):
        return self.db.table("users").update({"status": status}).eq("id", user_id).execute()

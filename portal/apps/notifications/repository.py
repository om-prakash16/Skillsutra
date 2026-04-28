from portal.core.supabase import get_supabase
from typing import Dict, Any, List

class NotificationRepository:
    def __init__(self):
        self.db = get_supabase()

    def create_notification(self, data: Dict[str, Any]):
        res = self.db.table("notifications").insert(data).execute()
        return res.data[0]

    def get_user_notifications(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        res = self.db.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
        return res.data

    def mark_as_read(self, notification_id: str):
        self.db.table("notifications").update({"is_read": True}).eq("id", notification_id).execute()
        return True

    def log_activity(self, data: Dict[str, Any]):
        self.db.table("activity_events").insert(data).execute()
        return True

from typing import List, Dict, Any, Optional
from uuid import UUID
from core.supabase import get_supabase
from modules.notifications.core.service import NotificationService

class CompetitionService:
    @staticmethod
    async def create_competition(data: Dict[str, Any], user_id: UUID) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        insert_data = {
            "title": data.get("title"),
            "description": data.get("description"),
            "comp_type": data.get("comp_type"),
            "skills_required": data.get("skills_required", []),
            "deadline": data.get("deadline"),
            "url": data.get("url"),
            "created_by": str(user_id)
        }

        response = db.table("competitions").insert(insert_data).execute()
        comp = response.data[0] if response.data else {}

        if comp:
            # Optionally trigger background matching task here
            pass

        return comp

    @staticmethod
    async def get_competitions() -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db:
            return []

        response = db.table("competitions").select("*").order("created_at", desc=True).execute()
        return response.data if response.data else []

    @staticmethod
    async def update_preferences(user_id: UUID, data: Dict[str, Any]) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        response = (
            db.table("user_competition_preferences")
            .upsert(
                {
                    "user_id": str(user_id),
                    "interested_types": data.get("interested_types", []),
                    "preferred_skills": data.get("preferred_skills", []),
                    "receive_notifications": data.get("receive_notifications", True)
                },
                on_conflict="user_id"
            )
            .execute()
        )
        return response.data[0] if response.data else {}

    @staticmethod
    async def get_preferences(user_id: UUID) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            return {}

        response = db.table("user_competition_preferences").select("*").eq("user_id", str(user_id)).single().execute()
        return response.data if response.data else {}

    @staticmethod
    async def notify_matches(competition_id: UUID) -> Dict[str, Any]:
        """
        Finds users whose preferences match the competition and sends them a notification.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        # 1. Fetch competition details
        comp_resp = db.table("competitions").select("*").eq("id", str(competition_id)).single().execute()
        comp = comp_resp.data
        if not comp:
            raise Exception("Competition not found")

        # 2. Fetch users who want notifications
        prefs_resp = db.table("user_competition_preferences").select("user_id, interested_types, preferred_skills").eq("receive_notifications", True).execute()
        prefs = prefs_resp.data if prefs_resp.data else []

        notified_count = 0
        comp_type = comp.get("comp_type")
        comp_skills = set(comp.get("skills_required", []))

        for pref in prefs:
            user_id = pref["user_id"]
            interested_types = pref.get("interested_types", [])
            preferred_skills = set(pref.get("preferred_skills", []))

            # Match logic: if type matches or if there's any skill intersection
            match = False
            if comp_type in interested_types:
                match = True
            elif comp_skills and preferred_skills and comp_skills.intersection(preferred_skills):
                match = True
            
            # Additional logic: if interested_types is empty, assume open to all
            if not interested_types and not preferred_skills:
                 match = True

            if match:
                await NotificationService.create_event_notification(
                    user_id=user_id,
                    type="competition_match",
                    title=f"New {comp_type.capitalize()} Match!",
                    message=f"Check out {comp.get('title')}, it aligns with your interests.",
                    link=f"/competitions"
                )
                notified_count += 1

        return {"notified_count": notified_count}

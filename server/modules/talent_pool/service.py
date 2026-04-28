from typing import List, Dict, Any, Optional
from uuid import UUID
from core.supabase import get_supabase
from modules.notifications.core.service import NotificationService

class TalentPoolService:
    @staticmethod
    async def save_talent(company_id: UUID, talent_id: UUID, user_id: UUID, notes: Optional[str] = None) -> Dict[str, Any]:
        """
        Save a talent for future roles for a specific company.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        # Get company details for the notification
        company_resp = db.table("companies").select("name").eq("id", str(company_id)).single().execute()
        company_name = company_resp.data.get("name", "A company") if company_resp.data else "A company"

        response = (
            db.table("company_saved_talent")
            .upsert(
                {
                    "company_id": str(company_id),
                    "user_id": str(talent_id),
                    "notes": notes,
                },
                on_conflict="company_id, user_id"
            )
            .execute()
        )

        if response.data:
            # Notify the talent
            await NotificationService.create_event_notification(
                user_id=talent_id,
                type="talent_saved",
                title="Selected for Future Roles",
                message=f"{company_name} has bookmarked your profile for potential future job opportunities!",
                link="/talent/discovery" # Or wherever the user can see companies that saved them
            )

            # Log Activity
            await NotificationService.log_activity(
                user_id=user_id,
                action_type="save_talent",
                entity_type="user",
                entity_id=talent_id,
                description=f"Saved talent {talent_id} for future roles in company {company_name}.",
            )

        return response.data[0] if response.data else {}

    @staticmethod
    async def remove_saved_talent(company_id: UUID, talent_id: UUID) -> bool:
        db = get_supabase()
        if not db:
            return False

        (
            db.table("company_saved_talent")
            .delete()
            .eq("company_id", str(company_id))
            .eq("user_id", str(talent_id))
            .execute()
        )
        return True

    @staticmethod
    async def get_saved_talent(company_id: UUID) -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db:
            return []

        response = (
            db.table("company_saved_talent")
            .select("*, users(id, full_name, profile_data, wallet_address)")
            .eq("company_id", str(company_id))
            .order("created_at", desc=True)
            .execute()
        )
        return response.data if response.data else []

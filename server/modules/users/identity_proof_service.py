from typing import Dict, Any, Optional
from core.supabase import get_supabase
from core.events import bus
from modules.notifications.service import NotificationService

# Event Constants
IDENTITY_VERIFIED = "IDENTITY_VERIFIED"
IDENTITY_REJECTED = "IDENTITY_REJECTED"

class IdentityProofService:
    @staticmethod
    async def submit_identity(user_id: str, id_type: str, document_url: str) -> Dict[str, Any]:
        """
        Submit a document for identity verification.
        """
        db = get_supabase()
        if not db: raise Exception("DB unavailable")
        
        response = db.table("user_identities").upsert({
            "user_id": user_id,
            "id_type": id_type,
            "id_document_url": document_url,
            "id_status": "pending",
            "updated_at": "now()"
        }).execute()
        
        # Notify Admins (Future: use staff notifications)
        await NotificationService.log_activity(
            user_id=user_id,
            action_type="identity_submission",
            entity_type="identity",
            description=f"User submitted {id_type} for verification."
        )
        
        return response.data[0] if response.data else {}

    @staticmethod
    async def verify_identity(user_id: str, admin_id: str, status: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """
        Approve or reject a user's identity proof.
        """
        db = get_supabase()
        if not db: raise Exception("DB unavailable")
        
        update_data = {
            "id_status": status,
            "verified_by": admin_id,
            "verified_at": "now()" if status == "verified" else None,
            "rejection_reason": reason if status == "rejected" else None,
            "updated_at": "now()"
        }
        
        response = db.table("user_identities").update(update_data).eq("user_id", user_id).execute()
        
        # Get user info for event
        user_resp = db.table("users").select("full_name, email").eq("id", user_id).single().execute()
        user_data = user_resp.data if user_resp.data else {}

        # Emit Global Event
        event_name = IDENTITY_VERIFIED if status == "verified" else IDENTITY_REJECTED
        await bus.emit(event_name, {
            "user_id": user_id,
            "email": user_data.get("email"),
            "name": user_data.get("full_name"),
            "status": status,
            "reason": reason,
            "user_id": user_id
        })

        # Notify User (Internal)
        msg = f"Your identity verification was {status}."
        if status == "rejected" and reason:
            msg += f" Reason: {reason}"
            
        await NotificationService.create_event_notification(
            user_id=user_id,
            type="identity_status",
            title="Verification Update",
            message=msg
        )
        
        return response.data[0] if response.data else {}

from uuid import UUID
from typing import Optional, Dict, Any, List
from core.db import get_db


class NotificationService:
    @staticmethod
    async def create_event_notification(
        user_id: Any,
        type: str,
        title: str,
        message: str,
        metadata: Optional[Dict[str, Any]] = None,
        link: Optional[str] = None,
    ):
        """
        Create a new persistent notification in the database.
        """
        db = get_db()
        if not db:
            return None

        notification_data = {
            "user_id": str(user_id),
            "type": type,
            "title": title,
            "message": message,
            "metadata": metadata or {},
            "link": link,
            "status": "unread",
        }

        response = db.table("notifications").insert(notification_data).execute()
        
        # Broadcast via WebSocket if the user is connected
        try:
            from modules.chat.ws_manager import manager
            import asyncio
            # Attempt to broadcast the notification payload
            asyncio.create_task(manager.send_personal_message(notification_data, str(user_id)))
        except Exception as e:
            # Silently fail if ws is not connected or there's an import issue
            print(f"WS Broadcast failed for notification: {e}")
            
        return response.data[0] if response.data else None

    @staticmethod
    async def log_activity(
        user_id: Optional[Any],
        action_type: str,
        entity_type: Optional[str] = None,
        entity_id: Optional[Any] = None,
        description: Optional[str] = None,
        tx_hash: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        """
        Record a persistent activity log for user history.
        """
        db = get_db()
        if not db:
            return None

        log_data = {
            "user_id": str(user_id) if user_id else None,
            "action_type": action_type,
            "entity_type": entity_type,
            "entity_id": str(entity_id) if entity_id else None,
            "description": description,
            "tx_hash": tx_hash,
            "metadata": metadata or {},
        }

        response = db.table("activity_logs").insert(log_data).execute()
        return response.data[0] if response.data else None

    @staticmethod
    async def get_user_notifications(
        user_id: Any, limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Fetch notifications for a specific user.
        """
        db = get_db()
        if not db:
            return []
        response = (
            db.table("notifications")
            .select("*")
            .eq("user_id", str(user_id))
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data if response.data else []

    @staticmethod
    async def mark_as_read(notification_id: UUID, user_id: UUID):
        """
        Mark a notification as read.
        """
        db = get_db()
        if not db:
            return
        db.table("notifications").update({"status": "read"}).eq(
            "id", str(notification_id)
        ).eq("user_id", str(user_id)).execute()

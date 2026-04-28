from portal.apps.notifications.repository import NotificationRepository
from typing import Dict, Any

class NotificationService:
    def __init__(self):
        self.repository = NotificationRepository()

    async def send_notification(self, user_id: str, title: str, message: str, type: str = "general"):
        return self.repository.create_notification({
            "user_id": user_id,
            "title": title,
            "message": message,
            "type": type
        })

    async def list_notifications(self, user_id: str):
        return self.repository.get_user_notifications(user_id)

    async def log_user_activity(self, user_id: str, action: str, description: str):
        return self.repository.log_activity({
            "user_id": user_id,
            "event_type": action,
            "description": description
        })

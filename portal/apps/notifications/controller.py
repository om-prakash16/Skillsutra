from portal.apps.notifications.service import NotificationService

class NotificationController:
    def __init__(self):
        self.service = NotificationService()

    async def get_my_notifications(self, user_id: str):
        return await self.service.list_notifications(user_id)

    async def mark_read(self, notification_id: str):
        return await self.service.repository.mark_as_read(notification_id)

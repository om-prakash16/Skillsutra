from portal.apps.notifications.service import NotificationService

notification_service = NotificationService()

async def handle_user_registered(data: dict):
    user_id = data.get("user_id")
    await notification_service.send_notification(
        user_id=user_id,
        title="Welcome!",
        message="Thank you for joining the Best Hiring Tool platform.",
        type="welcome"
    )

async def handle_identity_verified(data: dict):
    user_id = data.get("user_id")
    await notification_service.send_notification(
        user_id=user_id,
        title="Identity Verified",
        message="Your identity proof has been approved.",
        type="system"
    )

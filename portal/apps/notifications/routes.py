from fastapi import APIRouter, Depends
from portal.apps.notifications.controller import NotificationController
from portal.core.security import get_current_user

router = APIRouter()
controller = NotificationController()

@router.get("/")
async def get_notifications(user=Depends(get_current_user)):
    return await controller.get_my_notifications(user["sub"])

@router.post("/{notification_id}/read")
async def mark_notification_read(notification_id: str, user=Depends(get_current_user)):
    return await controller.mark_read(notification_id)

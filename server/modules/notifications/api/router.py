from fastapi import APIRouter, Depends, Query, Body, HTTPException
from uuid import UUID
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.response import success_response
from core.database import get_db_session
from modules.auth.core.service import get_current_user
from models.notifications import NotificationPreference, Notification, UserMute
from schemas.notifications import NotificationPreferencesUpdate, NotificationPreferencesResponse, UserMuteCreate

router = APIRouter()

@router.get("/preferences", response_model=Any)
async def get_notification_preferences(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Fetch the user's smart notification preferences."""
    user_id = UUID(current_user["id"])
    stmt = select(NotificationPreference).where(NotificationPreference.user_id == user_id)
    result = await db.execute(stmt)
    prefs = result.scalars().first()
    
    if not prefs:
        # Return default preferences if not yet configured
        return success_response(data={
            "user_id": str(user_id),
            "channels": {"email": True, "push": True, "in_app": True, "websocket": True},
            "categories": {},
            "quiet_hours": {"start": "22:00", "end": "08:00", "timezone": "UTC"},
            "frequency": "IMMEDIATE"
        })
        
    return success_response(data=prefs)

@router.patch("/preferences")
async def update_notification_preferences(
    payload: NotificationPreferencesUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Update user notification preferences."""
    user_id = UUID(current_user["id"])
    stmt = select(NotificationPreference).where(NotificationPreference.user_id == user_id)
    result = await db.execute(stmt)
    prefs = result.scalars().first()
    
    if not prefs:
        prefs = NotificationPreference(
            user_id=user_id,
            channels=payload.channels.dict() if payload.channels else {"email": True, "push": True, "in_app": True, "websocket": True},
            categories=payload.categories or {},
            quiet_hours=payload.quiet_hours.dict() if payload.quiet_hours else {"start": "22:00", "end": "08:00", "timezone": "UTC"},
            frequency=payload.frequency or "IMMEDIATE"
        )
        db.add(prefs)
    else:
        if payload.channels is not None:
            prefs.channels = payload.channels.dict()
        if payload.categories is not None:
            prefs.categories = payload.categories
        if payload.quiet_hours is not None:
            prefs.quiet_hours = payload.quiet_hours.dict()
        if payload.frequency is not None:
            prefs.frequency = payload.frequency

    await db.commit()
    await db.refresh(prefs)
    
    return success_response(data=prefs, message="Notification preferences updated")

@router.post("/mutes")
async def mute_entity(
    payload: UserMuteCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Mute a specific company, user, or community to prevent notifications."""
    user_id = UUID(current_user["id"])
    
    mute = UserMute(
        user_id=user_id,
        target_type=payload.target_type,
        target_id=payload.target_id
    )
    db.add(mute)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        return success_response(data=None, message="Entity is already muted")
        
    return success_response(data=None, message=f"{payload.target_type} muted successfully")

@router.get("/")
async def get_notifications(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db_session)
):
    """Fetch the in-app notification inbox."""
    user_id = UUID(current_user["id"])
    stmt = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc()).limit(limit)
    result = await db.execute(stmt)
    notifications = result.scalars().all()
    
    return success_response(data=notifications)

@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Mark a specific notification as read."""
    user_id = UUID(current_user["id"])
    stmt = select(Notification).where(Notification.id == notification_id, Notification.user_id == user_id)
    result = await db.execute(stmt)
    notification = result.scalars().first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    await db.commit()
    
    return success_response(data=None, message="Notification marked as read")

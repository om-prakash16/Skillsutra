from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional

from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/communication", tags=["Communication"])

# ==========================================
# NOTIFICATIONS
# ==========================================

@router.get("/notifications")
async def get_notifications(
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    unread_only: bool = Query(False),
    user=Depends(get_current_user)
):
    """Fetch paginated notifications for the current user."""
    from core.database import AsyncSessionLocal
    from models.communication import Notification
    from sqlalchemy import select
    
    async with AsyncSessionLocal() as db:
        query = select(Notification).where(Notification.user_id == user["id"])
        
        if unread_only:
            query = query.where(Notification.is_read == False)
            
        query = query.order_by(Notification.created_at.desc()).limit(limit).offset(offset)
        result = await db.execute(query)
        notifications = result.scalars().all()
        
        data = [{
            "id": str(n.id),
            "type": n.type,
            "priority": n.priority,
            "title": n.title,
            "description": n.description,
            "action_url": n.action_url,
            "is_read": n.is_read,
            "created_at": str(n.created_at)
        } for n in notifications]
        
        return success_response(data=data)

@router.patch("/notifications/{id}/read")
async def mark_notification_read(
    id: str,
    user=Depends(get_current_user)
):
    """Mark a specific notification as read."""
    from core.database import AsyncSessionLocal
    from models.communication import Notification
    from sqlalchemy import select
    from datetime import datetime
    
    async with AsyncSessionLocal() as db:
        query = select(Notification).where(Notification.id == id, Notification.user_id == user["id"])
        result = await db.execute(query)
        notification = result.scalars().first()
        
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
            
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        await db.commit()
        
        return success_response(message="Notification marked as read")

# ==========================================
# ACTIVITY FEED
# ==========================================

@router.get("/feed/activity")
async def get_activity_feed(
    limit: int = Query(20),
    offset: int = Query(0),
    user=Depends(get_current_user)
):
    """Fetch the chronological activity feed engine."""
    from core.database import AsyncSessionLocal
    from models.communication import ActivityEvent
    from sqlalchemy import select
    
    async with AsyncSessionLocal() as db:
        # In a real app, this would filter by the user's connections/followed companies.
        # For now, we return public events.
        query = select(ActivityEvent).where(ActivityEvent.visibility == "PUBLIC").order_by(ActivityEvent.created_at.desc()).limit(limit).offset(offset)
        result = await db.execute(query)
        events = result.scalars().all()
        
        data = [{
            "id": str(e.id),
            "actor_id": str(e.actor_id),
            "action_type": e.action_type,
            "target_entity_type": e.target_entity_type,
            "metadata_payload": e.metadata_payload,
            "created_at": str(e.created_at)
        } for e in events]
        
        return success_response(data=data)

# ==========================================
# AUTOMATIONS
# ==========================================

@router.get("/automations")
async def get_active_automations(
    company_id: Optional[str] = Query(None),
    user=Depends(get_current_user)
):
    """List workflow automations for a company."""
    from core.database import AsyncSessionLocal
    from models.automation import WorkflowAutomation
    from sqlalchemy import select
    
    async with AsyncSessionLocal() as db:
        query = select(WorkflowAutomation)
        if company_id:
            query = query.where(WorkflowAutomation.company_id == company_id)
        else:
            # System-wide automations
            query = query.where(WorkflowAutomation.company_id == None)
            
        result = await db.execute(query)
        workflows = result.scalars().all()
        
        data = [{
            "id": str(w.id),
            "name": w.name,
            "trigger_event": w.trigger_event,
            "conditions": w.conditions,
            "actions": w.actions,
            "is_active": w.is_active
        } for w in workflows]
        
        return success_response(data=data)

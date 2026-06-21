from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from uuid import UUID

from core.database import get_db_session
from core.dependencies import get_current_user_id
from schemas.enterprise import EnterprisePaginatedResponse
from models.security import SecurityEvent
from models.user import User

router = APIRouter(prefix="/admin/security-events", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_security_events(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """View global security operations dashboard."""
    query = select(SecurityEvent, User).outerjoin(User, SecurityEvent.user_id == User.id)
    
    if search:
        query = query.where(
            SecurityEvent.description.ilike(f"%{search}%") | 
            SecurityEvent.ip_address.ilike(f"%{search}%") |
            User.email.ilike(f"%{search}%")
        )
        
    if severity:
        query = query.where(SecurityEvent.severity == severity.upper())
        
    if event_type:
        query = query.where(SecurityEvent.event_type == event_type)
        
    if user_id:
        query = query.where(SecurityEvent.user_id == UUID(user_id))
        
    query = query.order_by(desc(SecurityEvent.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    records = res.all()
    
    count_query = select(SecurityEvent)
    if severity:
        count_query = count_query.where(SecurityEvent.severity == severity.upper())
    if event_type:
        count_query = count_query.where(SecurityEvent.event_type == event_type)
    if user_id:
        count_query = count_query.where(SecurityEvent.user_id == UUID(user_id))
        
    total_res = await db.execute(count_query)
    total = len(total_res.scalars().all())
    
    data = []
    for evt, user in records:
        data.append({
            "id": str(evt.id),
            "user": {
                "id": str(user.id) if user else str(evt.user_id),
                "email": user.email if user else "Unknown"
            },
            "event_type": evt.event_type,
            "severity": evt.severity,
            "description": evt.description,
            "ip_address": evt.ip_address,
            "device_id": evt.device_id,
            "created_at": evt.created_at
        })
        
    return EnterprisePaginatedResponse(
        data=data,
        meta={
            "total": total,
            "page": page,
            "size": size,
            "has_more": (page * size) < total
        }
    )

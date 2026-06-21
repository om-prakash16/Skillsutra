from fastapi import APIRouter, Depends, Query, HTTPException, Body
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from uuid import UUID

from core.database import get_db_session
from core.dependencies import get_current_user_id
from schemas.enterprise import (
    EnterpriseResponseEnvelope, 
    EnterprisePaginatedResponse,
)
from models.session import Session
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/sessions", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_sessions(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List Active Sessions."""
    query = select(Session)
    
    if search:
        query = query.where(Session.ip_address.ilike(f"%{search}%"))
        
    query = query.order_by(desc(Session.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    sessions = res.scalars().all()
    
    total_res = await db.execute(select(Session))
    total = len(total_res.scalars().all())
    
    data = []
    for s in sessions:
        data.append({
            "id": str(s.id),
            "user_id": str(s.user_id),
            "device_id": str(s.device_id) if s.device_id else None,
            "browser": s.browser,
            "os": s.os,
            "ip_address": s.ip_address,
            "country": s.country,
            "city": s.city,
            "login_method": s.login_method,
            "mfa_used": s.mfa_used,
            "oauth_provider": s.oauth_provider,
            "risk_score": s.risk_score,
            "jti": s.jti,
            "is_active": s.is_active,
            "expires_at": s.expires_at,
            "created_at": s.created_at
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

@router.post("/{session_id}/terminate", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def terminate_session(
    session_id: UUID,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Terminate a single session."""
    res = await db.execute(select(Session).where(Session.id == session_id))
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session.is_active = False
    await db.commit()
    
    # Notify event bus so Redis invalidation can happen asynchronously
    await platform_events.publish(
        event_type=EventTypes.DELETED,
        entity_type="session",
        entity_id=str(session.id),
        actor_id=admin_id,
        payload={"action": "terminated", "jti": session.jti}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(session.id), "status": "terminated"},
        message="Session terminated successfully"
    )

@router.post("/terminate-other", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def terminate_other_sessions(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Terminate all sessions for a user EXCEPT the specified one."""
    user_id = payload.get("user_id")
    keep_session_id = payload.get("keep_session_id")
    
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
        
    res = await db.execute(select(Session).where(Session.user_id == UUID(user_id)))
    sessions = res.scalars().all()
    
    terminated_ids = []
    for s in sessions:
        if str(s.id) != keep_session_id and s.is_active:
            s.is_active = False
            terminated_ids.append(str(s.id))
            
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="user",
        entity_id=user_id,
        actor_id=admin_id,
        payload={"action": "terminated_other_sessions", "terminated_count": len(terminated_ids)}
    )
    
    return EnterpriseResponseEnvelope(
        data={"terminated_count": len(terminated_ids), "terminated_ids": terminated_ids},
        message=f"{len(terminated_ids)} other sessions terminated"
    )

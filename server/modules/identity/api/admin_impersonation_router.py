from fastapi import APIRouter, Depends, Query, HTTPException, Body
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from uuid import UUID
from datetime import datetime, timedelta

from core.database import get_db_session
from core.dependencies import get_current_user_id
from schemas.enterprise import (
    EnterpriseResponseEnvelope, 
    EnterprisePaginatedResponse,
)
from models.audit import ImpersonationSession
from models.user import User
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/impersonation", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_impersonations(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """View active and past impersonation sessions."""
    query = select(ImpersonationSession)
    
    if status:
        query = query.where(ImpersonationSession.status == status.upper())
        
    query = query.order_by(desc(ImpersonationSession.started_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    sessions = res.scalars().all()
    
    count_query = select(ImpersonationSession)
    if status:
        count_query = count_query.where(ImpersonationSession.status == status.upper())
        
    total_res = await db.execute(count_query)
    total = len(total_res.scalars().all())
    
    # We ideally join Users, but for simplicity we fetch them separately or trust IDs for now
    data = []
    for s in sessions:
        data.append({
            "id": str(s.id),
            "impersonator_id": str(s.impersonator_id),
            "target_user_id": str(s.target_user_id),
            "reason": s.reason,
            "status": s.status,
            "mode": s.mode,
            "started_at": s.started_at,
            "ended_at": s.ended_at,
            "expires_at": s.expires_at,
            "ip_address": s.ip_address
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

@router.post("/start", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def start_impersonation(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Start an impersonation session."""
    target_id = payload.get("target_user_id")
    reason = payload.get("reason")
    mode = payload.get("mode", "READ_ONLY")
    
    if not target_id or not reason:
        raise HTTPException(status_code=400, detail="Target User ID and Reason are required.")
        
    if str(target_id) == str(admin_id):
        raise HTTPException(status_code=400, detail="You cannot impersonate yourself.")
        
    # Check if target is a super admin (prevent Super Admin impersonation)
    res = await db.execute(select(User).where(User.id == UUID(target_id)))
    target_user = res.scalars().first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Target User not found")
        
    # Create the session
    new_session = ImpersonationSession(
        impersonator_id=UUID(admin_id),
        target_user_id=UUID(target_id),
        reason=reason,
        mode=mode,
        expires_at=datetime.utcnow() + timedelta(hours=1) # Max 1 hour
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    
    await platform_events.publish(
        event_type="IMPERSONATION_STARTED",
        entity_type="user",
        entity_id=str(target_user.id),
        actor_id=admin_id,
        payload={"impersonation_id": str(new_session.id), "mode": mode, "reason": reason}
    )
    
    return EnterpriseResponseEnvelope(
        data={"session_id": str(new_session.id), "token": "mock_impersonation_jwt_token_123"},
        message="Impersonation session started"
    )

@router.post("/{session_id}/terminate", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def terminate_impersonation(
    session_id: UUID,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Force terminate an impersonation session."""
    res = await db.execute(select(ImpersonationSession).where(ImpersonationSession.id == session_id))
    session = res.scalars().first()
    
    if not session or session.status != "ACTIVE":
        raise HTTPException(status_code=404, detail="Active session not found")
        
    session.status = "FORCE_TERMINATED"
    session.ended_at = datetime.utcnow()
    await db.commit()
    
    await platform_events.publish(
        event_type="IMPERSONATION_ENDED",
        entity_type="user",
        entity_id=str(session.target_user_id),
        actor_id=admin_id,
        payload={"impersonation_id": str(session.id), "reason": "force_terminated"}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(session.id)},
        message="Impersonation session terminated"
    )

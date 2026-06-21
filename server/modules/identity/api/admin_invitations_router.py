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
from models.iam import Invitation
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/invitations", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_invitations(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List pending/accepted/expired invitations."""
    query = select(Invitation)
    
    if search:
        query = query.where(Invitation.email.ilike(f"%{search}%"))
    if status:
        query = query.where(Invitation.status == status)
        
    query = query.order_by(desc(Invitation.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    invitations = res.scalars().all()
    
    total_res = await db.execute(select(Invitation))
    total = len(total_res.scalars().all())
    
    data = []
    for inv in invitations:
        data.append({
            "id": str(inv.id),
            "email": inv.email,
            "status": inv.status,
            "organization_id": str(inv.organization_id) if inv.organization_id else None,
            "role_id": str(inv.role_id) if inv.role_id else None,
            "expires_at": inv.expires_at,
            "created_at": inv.created_at
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

@router.post("", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def create_invitation(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new user invitation."""
    import secrets
    import hashlib
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    
    new_inv = Invitation(
        email=payload.get("email"),
        status="pending",
        organization_id=UUID(payload["organization_id"]) if payload.get("organization_id") else None,
        role_id=UUID(payload["role_id"]) if payload.get("role_id") else None,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + timedelta(days=7),
        invited_by_id=UUID(admin_id)
    )
    db.add(new_inv)
    await db.commit()
    await db.refresh(new_inv)
    
    await platform_events.publish(
        event_type=EventTypes.CREATED,
        entity_type="invitation",
        entity_id=str(new_inv.id),
        actor_id=admin_id,
        payload={"email": new_inv.email, "raw_token": raw_token}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(new_inv.id), "invite_link": f"/invite/{raw_token}"},
        message="Invitation sent"
    )

@router.post("/{invitation_id}/cancel", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def cancel_invitation(
    invitation_id: UUID,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Cancel a pending invitation."""
    res = await db.execute(select(Invitation).where(Invitation.id == invitation_id))
    inv = res.scalars().first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation not found")
        
    inv.status = "cancelled"
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="invitation",
        entity_id=str(inv.id),
        actor_id=admin_id,
        payload={"status": "cancelled"}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(inv.id), "status": "cancelled"},
        message="Invitation cancelled"
    )

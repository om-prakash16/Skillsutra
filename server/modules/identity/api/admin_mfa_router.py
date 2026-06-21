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
from models.iam import MFAMethod
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/mfa", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_mfa_methods(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    user_id: Optional[UUID] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List MFA setups for users."""
    query = select(MFAMethod)
    
    if user_id:
        query = query.where(MFAMethod.user_id == user_id)
        
    query = query.order_by(desc(MFAMethod.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    methods = res.scalars().all()
    
    total_res = await db.execute(select(MFAMethod))
    total = len(total_res.scalars().all())
    
    data = []
    for m in methods:
        data.append({
            "id": str(m.id),
            "user_id": str(m.user_id),
            "method_type": m.method_type,
            "is_primary": m.is_primary,
            "is_enabled": m.is_enabled,
            "last_used_at": m.last_used_at,
            "created_at": m.created_at
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

@router.post("/{mfa_id}/disable", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def disable_mfa(
    mfa_id: UUID,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Administratively disable a user's MFA method."""
    res = await db.execute(select(MFAMethod).where(MFAMethod.id == mfa_id))
    mfa = res.scalars().first()
    if not mfa:
        raise HTTPException(status_code=404, detail="MFA method not found")
        
    mfa.is_enabled = False
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="mfa_method",
        entity_id=str(mfa.id),
        actor_id=admin_id,
        payload={"action": "disabled"}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(mfa.id), "status": "disabled"},
        message="MFA method administratively disabled"
    )

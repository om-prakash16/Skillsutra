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
from models.identity import VerificationRequest
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/verification", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_verification_requests(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    verification_type: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List verification requests."""
    query = select(VerificationRequest)
    
    if status:
        query = query.where(VerificationRequest.status == status)
    if verification_type:
        query = query.where(VerificationRequest.verification_type == verification_type)
        
    query = query.order_by(desc(VerificationRequest.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    requests = res.scalars().all()
    
    total_res = await db.execute(select(VerificationRequest))
    total = len(total_res.scalars().all())
    
    data = []
    for r in requests:
        data.append({
            "id": str(r.id),
            "user_id": str(r.user_id),
            "verification_type": r.verification_type,
            "status": r.status,
            "document_url": r.document_url,
            "reviewer_id": str(r.reviewer_id) if r.reviewer_id else None,
            "reviewed_at": r.reviewed_at,
            "created_at": r.created_at
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

@router.post("/{request_id}/approve", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def approve_verification(
    request_id: UUID,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Approve a verification request."""
    res = await db.execute(select(VerificationRequest).where(VerificationRequest.id == request_id))
    req = res.scalars().first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    from datetime import datetime
    req.status = "approved"
    req.reviewer_id = UUID(admin_id)
    req.reviewed_at = datetime.utcnow()
    
    # Normally, this would also update User.is_verified if appropriate
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="verification_request",
        entity_id=str(req.id),
        actor_id=admin_id,
        payload={"status": "approved"}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(req.id), "status": "approved"},
        message="Verification request approved"
    )

@router.post("/{request_id}/reject", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def reject_verification(
    request_id: UUID,
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Reject a verification request."""
    res = await db.execute(select(VerificationRequest).where(VerificationRequest.id == request_id))
    req = res.scalars().first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    from datetime import datetime
    req.status = "rejected"
    req.reviewer_id = UUID(admin_id)
    req.reviewed_at = datetime.utcnow()
    req.notes = payload.get("reason", "No reason provided")
    
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="verification_request",
        entity_id=str(req.id),
        actor_id=admin_id,
        payload={"status": "rejected", "reason": req.notes}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(req.id), "status": "rejected"},
        message="Verification request rejected"
    )

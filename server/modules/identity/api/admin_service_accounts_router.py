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
from models.iam import ServiceAccount
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/service-accounts", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_service_accounts(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List Service Accounts."""
    query = select(ServiceAccount)
    
    if search:
        query = query.where(ServiceAccount.name.ilike(f"%{search}%") | ServiceAccount.description.ilike(f"%{search}%"))
        
    query = query.order_by(desc(ServiceAccount.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    accounts = res.scalars().all()
    
    total_res = await db.execute(select(ServiceAccount))
    total = len(total_res.scalars().all())
    
    data = []
    for a in accounts:
        data.append({
            "id": str(a.id),
            "name": a.name,
            "description": a.description,
            "organization_id": str(a.organization_id) if a.organization_id else None,
            "workspace_id": str(a.workspace_id) if a.workspace_id else None,
            "role_id": str(a.role_id) if a.role_id else None,
            "is_active": a.is_active,
            "created_at": a.created_at
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
async def create_service_account(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new Service Account."""
    new_sa = ServiceAccount(
        name=payload["name"],
        description=payload.get("description"),
        organization_id=UUID(payload["organization_id"]) if payload.get("organization_id") else None,
        workspace_id=UUID(payload["workspace_id"]) if payload.get("workspace_id") else None,
        role_id=UUID(payload["role_id"]) if payload.get("role_id") else None
    )
    db.add(new_sa)
    await db.commit()
    await db.refresh(new_sa)
    
    await platform_events.publish(
        event_type=EventTypes.CREATED,
        entity_type="service_account",
        entity_id=str(new_sa.id),
        actor_id=admin_id,
        payload={"name": new_sa.name}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(new_sa.id)},
        message="Service Account created successfully"
    )

@router.post("/{sa_id}/toggle", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def toggle_service_account(
    sa_id: UUID,
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Enable or disable a service account."""
    res = await db.execute(select(ServiceAccount).where(ServiceAccount.id == sa_id))
    sa = res.scalars().first()
    if not sa:
        raise HTTPException(status_code=404, detail="Service Account not found")
        
    is_active = payload.get("is_active", True)
    sa.is_active = is_active
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="service_account",
        entity_id=str(sa.id),
        actor_id=admin_id,
        payload={"action": "toggle", "is_active": is_active}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(sa.id), "is_active": sa.is_active},
        message=f"Service Account {'enabled' if is_active else 'disabled'}"
    )

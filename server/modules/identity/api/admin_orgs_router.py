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
from models.organization import Organization
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/organizations", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_organizations(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List organizations in the platform."""
    query = select(Organization)
    
    if search:
        query = query.where(Organization.name.ilike(f"%{search}%"))
        
    query = query.order_by(desc(Organization.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    orgs = res.scalars().all()
    
    total_res = await db.execute(select(Organization))
    total = len(total_res.scalars().all())
    
    data = []
    for org in orgs:
        data.append({
            "id": str(org.id),
            "name": org.name,
            "slug": org.slug,
            "domain": org.domain,
            "status": "Active" if org.is_active else "Inactive",
            "created_at": org.created_at
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
async def create_organization(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new organization (Tenant)."""
    new_org = Organization(
        name=payload.get("name"),
        slug=payload.get("slug"),
        domain=payload.get("domain"),
        is_active=payload.get("is_active", True)
    )
    db.add(new_org)
    await db.commit()
    await db.refresh(new_org)
    
    await platform_events.publish(
        event_type=EventTypes.CREATED,
        entity_type="organization",
        entity_id=str(new_org.id),
        actor_id=admin_id,
        payload={"name": new_org.name}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(new_org.id)},
        message="Organization created"
    )

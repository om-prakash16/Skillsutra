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
from models.core import Role
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/roles", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_roles(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List RBAC Roles."""
    query = select(Role)
    
    if search:
        query = query.where(Role.role_name.ilike(f"%{search}%"))
        
    query = query.order_by(desc(Role.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    roles = res.scalars().all()
    
    total_res = await db.execute(select(Role))
    total = len(total_res.scalars().all())
    
    data = []
    for r in roles:
        data.append({
            "id": str(r.id),
            "role_name": r.role_name,
            "description": r.description,
            "permissions": r.permissions,
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

@router.post("", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def create_role(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new Role."""
    new_role = Role(
        role_name=payload.get("role_name"),
        description=payload.get("description"),
        permissions=payload.get("permissions", [])
    )
    db.add(new_role)
    await db.commit()
    await db.refresh(new_role)
    
    await platform_events.publish(
        event_type=EventTypes.CREATED,
        entity_type="role",
        entity_id=str(new_role.id),
        actor_id=admin_id,
        payload={"role_name": new_role.role_name}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(new_role.id)},
        message="Role created"
    )

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
from models.organization import Team
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/teams", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_teams(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    organization_id: Optional[UUID] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List nested teams and organizational units."""
    query = select(Team)
    
    if search:
        query = query.where(Team.name.ilike(f"%{search}%"))
    if organization_id:
        query = query.where(Team.organization_id == organization_id)
        
    query = query.order_by(desc(Team.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    teams = res.scalars().all()
    
    total_res = await db.execute(select(Team))
    total = len(total_res.scalars().all())
    
    data = []
    for t in teams:
        data.append({
            "id": str(t.id),
            "name": t.name,
            "description": t.description,
            "organization_id": str(t.organization_id),
            "created_at": t.created_at
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
async def create_team(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new team/department."""
    new_team = Team(
        name=payload.get("name"),
        description=payload.get("description"),
        organization_id=UUID(payload["organization_id"])
    )
    db.add(new_team)
    await db.commit()
    await db.refresh(new_team)
    
    await platform_events.publish(
        event_type=EventTypes.CREATED,
        entity_type="team",
        entity_id=str(new_team.id),
        actor_id=admin_id,
        payload={"name": new_team.name}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(new_team.id)},
        message="Team created"
    )

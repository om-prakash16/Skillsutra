from fastapi import APIRouter, Depends, Body, HTTPException
from typing import Dict, Any, List
import logging
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from core.response import success_response
from core.database import get_db_session
from sqlalchemy.ext.asyncio import AsyncSession
from modules.auth.core.guards import require_permission
from models.core import Role

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def list_roles(
    session: AsyncSession = Depends(get_db_session),
    user=Depends(require_permission("view", "roles"))
):
    """List all available roles and templates."""
    stmt = select(Role)
    result = await session.execute(stmt)
    roles = result.scalars().all()
    
    return success_response(
        data=[
            {
                "id": str(r.id),
                "name": r.role_name,
                "description": r.description,
                "is_template": r.is_template,
                "permissions": r.permissions
            }
            for r in roles
        ]
    )


@router.post("/")
async def create_role(
    payload: Dict[str, Any] = Body(...),
    session: AsyncSession = Depends(get_db_session),
    user=Depends(require_permission("create", "roles"))
):
    """Create a new role or clone from a template."""
    name = payload.get("name")
    description = payload.get("description")
    permissions = payload.get("permissions", [])
    is_template = payload.get("is_template", False)
    
    new_role = Role(
        role_name=name,
        description=description,
        permissions=permissions,
        is_template=is_template
    )
    
    session.add(new_role)
    await session.commit()
    await session.refresh(new_role)
    
    return success_response(
        message=f"Role {name} created successfully.",
        data={"id": str(new_role.id), "name": new_role.role_name}
    )


@router.put("/{role_id}")
async def update_role(
    role_id: str,
    payload: Dict[str, Any] = Body(...),
    session: AsyncSession = Depends(get_db_session),
    user=Depends(require_permission("edit", "roles"))
):
    """Update role permissions or details."""
    stmt = select(Role).where(Role.id == role_id)
    result = await session.execute(stmt)
    role = result.scalars().first()
    
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
        
    if "name" in payload:
        role.role_name = payload["name"]
    if "description" in payload:
        role.description = payload["description"]
    if "permissions" in payload:
        role.permissions = payload["permissions"]
        
    await session.commit()
    
    return success_response(message="Role updated successfully.")

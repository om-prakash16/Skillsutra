from fastapi import APIRouter, Depends, Body, HTTPException
from typing import Dict, Any, List
import logging
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from core.response import success_response
from core.database import get_db_session
from sqlalchemy.ext.asyncio import AsyncSession
from modules.auth.core.guards import require_permission
from models.user import User
from models.core import Role, user_roles
from models.rbac import UserRoleScope, ApprovalRequest

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def list_members(
    session: AsyncSession = Depends(get_db_session),
    user=Depends(require_permission("view", "users"))
):
    """List members and their scopes."""
    stmt = select(UserRoleScope).options(selectinload(UserRoleScope.role))
    result = await session.execute(stmt)
    scopes = result.scalars().all()
    
    # We should return users with their scoped roles
    # For now, we return the scope entries
    return success_response(
        data=[
            {
                "id": str(s.id),
                "user_id": str(s.user_id),
                "role_name": s.role.role_name if s.role else None,
                "platform_scope": s.platform_scope,
                "tenant_id": s.tenant_id,
                "workspace_id": s.workspace_id
            }
            for s in scopes
        ]
    )

@router.post("/")
async def provision_member(
    payload: Dict[str, Any] = Body(...),
    session: AsyncSession = Depends(get_db_session),
    user=Depends(require_permission("create", "users"))
):
    """
    Advanced Member Provisioning
    Handles scopes and workflow checks.
    """
    user_id = payload.get("user_id")
    role_id = payload.get("role_id")
    tenant_id = payload.get("tenant_id")
    
    # Example logic: Sensitive roles like Platform Admin trigger an Approval Workflow
    # For now, we'll assign the scope directly
    new_scope = UserRoleScope(
        user_id=user_id,
        role_id=role_id,
        tenant_id=tenant_id
    )
    session.add(new_scope)
    await session.commit()
    
    return success_response(message="Member provisioned successfully.")


@router.post("/workflows")
async def request_approval(
    payload: Dict[str, Any] = Body(...),
    session: AsyncSession = Depends(get_db_session),
    user=Depends(require_permission("create", "workflows"))
):
    """Submit a sensitive action for approval."""
    action = payload.get("action_type")
    data = payload.get("payload")
    reason = payload.get("reason")
    
    req = ApprovalRequest(
        requester_id=user["id"],
        action_type=action,
        payload=data,
        reason=reason
    )
    session.add(req)
    await session.commit()
    
    return success_response(message="Approval request submitted.")

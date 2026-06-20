from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db_session
from core.dependencies import get_current_user_id, get_company_id, require_company_permission
from core.response import success_response
from models.core import CompanyMember, CompanyInvite, Company, CompanyRole
from models.user import User
from core.permissions import CAN_MANAGE_TEAM
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel

router = APIRouter()

class InviteRequest(BaseModel):
    email: str
    role_name: str = "member"

class RoleUpdateRequest(BaseModel):
    role_name: str

@router.get("/")
async def get_team(
    company_id: str = Depends(get_company_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Return all members of the company."""
    query = select(CompanyMember, User, CompanyRole).join(User).outerjoin(CompanyRole).where(CompanyMember.company_id == company_id)
    result = await db.execute(query)
    members = []
    for member, user, role in result.all():
        members.append({
            "id": str(member.id),
            "user_id": str(user.id),
            "name": user.username or user.email,
            "email": user.email,
            "role": role.name if role else "member",
            "status": member.status,
            "last_active": member.last_active,
            "metrics": member.performance_metrics
        })
    return success_response(data=members)

@router.post("/invite/email", dependencies=[Depends(require_company_permission(CAN_MANAGE_TEAM))])
async def send_email_invite(
    req: InviteRequest,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Invite a user to the company via email."""
    
    # Resolve role ID
    role_query = select(CompanyRole).where(
        CompanyRole.company_id == company_id,
        CompanyRole.name == req.role_name
    )
    res = await db.execute(role_query)
    role = res.scalars().first()
    
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role name specified")

    import secrets
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    invite = CompanyInvite(
        company_id=company_id,
        email=req.email,
        company_role_id=role.id,
        token=token,
        status="PENDING",
        created_by_id=user_id,
        expires_at=expires_at
    )
    db.add(invite)
    await db.commit()
    
    # Audit log
    from models.audit import AuditLog
    audit_log = AuditLog(
        company_id=company_id,
        user_id=user_id,
        action="USER_INVITED",
        resource_type="company_invite",
        resource_id=str(invite.id),
        details={"email": req.email, "role": role.name}
    )
    db.add(audit_log)
    await db.commit()
    
    # Send email
    from core.email import send_email_async
    import os
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    invite_link = f"{frontend_url}/company/invite/accept?token={token}"
    
    company_res = await db.execute(select(Company).where(Company.id == company_id))
    company = company_res.scalars().first()
    company_name = company.company_name if company else "our company"
    
    subject = f"You've been invited to join {company_name} on Skillsutra"
    html = f"""
    <h2>Join {company_name}</h2>
    <p>You have been invited to join {company_name} as a {req.role_name}.</p>
    <p><a href="{invite_link}">Click here to accept the invitation</a></p>
    """
    try:
        await send_email_async(req.email, subject, html)
    except Exception:
        pass

    return success_response(message="Invitation sent successfully", data={"token": token})

@router.post("/invite/link", dependencies=[Depends(require_company_permission(CAN_MANAGE_TEAM))])
async def generate_invite_link(
    req: RoleUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Generate a shareable invite link for a specific role."""
    role_query = select(CompanyRole).where(
        CompanyRole.company_id == company_id,
        CompanyRole.name == req.role_name
    )
    res = await db.execute(role_query)
    role = res.scalars().first()
    
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role name specified")

    import secrets
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=30)
    
    invite = CompanyInvite(
        company_id=company_id,
        company_role_id=role.id,
        token=token,
        status="PENDING",
        is_reusable_link=True,
        created_by_id=user_id,
        expires_at=expires_at
    )
    db.add(invite)
    await db.commit()
    
    import os
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    invite_link = f"{frontend_url}/company/invite/accept?token={token}"
    
    return success_response(message="Link generated successfully", data={"link": invite_link})

@router.get("/invite/verify")
async def verify_invite(
    token: str,
    db: AsyncSession = Depends(get_db_session)
):
    """Verify an invite token before accepting."""
    query = select(CompanyInvite, Company, CompanyRole).join(Company).outerjoin(CompanyRole).where(CompanyInvite.token == token)
    result = await db.execute(query)
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=400, detail="Invalid invite link")
        
    invite, company, role = row
    
    if invite.status != "PENDING" and not invite.is_reusable_link:
        raise HTTPException(status_code=400, detail="This invite has already been used")
        
    if invite.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="This invite has expired")
        
    return success_response(data={
        "company_name": company.company_name,
        "role": role.name if role else "member",
        "email": invite.email
    })

@router.post("/invite/accept")
async def accept_invite(
    token: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Accept an invite using a token."""
    query = select(CompanyInvite).where(CompanyInvite.token == token)
    result = await db.execute(query)
    invite = result.scalars().first()
    
    if not invite:
        raise HTTPException(status_code=400, detail="Invalid invite link")
        
    if invite.status != "PENDING" and not invite.is_reusable_link:
        raise HTTPException(status_code=400, detail="This invite has already been used")
        
    if invite.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="This invite has expired")
        
    # Check if user is already a member
    member_query = select(CompanyMember).where(
        CompanyMember.company_id == invite.company_id,
        CompanyMember.user_id == user_id
    )
    result = await db.execute(member_query)
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="You are already a member of this company")
    
    new_member = CompanyMember(
        company_id=invite.company_id,
        user_id=user_id,
        company_role_id=invite.company_role_id,
        status="ACTIVE"
    )
    db.add(new_member)
    
    if not invite.is_reusable_link:
        invite.status = "ACCEPTED"
        
    await db.commit()
    return success_response(message="Successfully joined company")

@router.put("/{member_id}/role", dependencies=[Depends(require_company_permission(CAN_MANAGE_TEAM))])
async def update_member_role(
    member_id: str,
    req: RoleUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Update a team member's role."""
    
    # Find new role ID
    role_query = select(CompanyRole).where(
        CompanyRole.company_id == company_id,
        CompanyRole.name == req.role_name
    )
    res = await db.execute(role_query)
    new_role = res.scalars().first()
    
    if not new_role:
        raise HTTPException(status_code=400, detail="Invalid role name specified")

    target_query = select(CompanyMember).where(
        CompanyMember.company_id == company_id,
        CompanyMember.id == member_id
    )
    result = await db.execute(target_query)
    target = result.scalars().first()
    
    if not target:
        raise HTTPException(status_code=404, detail="Member not found")
        
    # Optional: Prevent removing the last owner. (Can be implemented here)
    
    target.company_role_id = new_role.id
    
    # Audit log
    from models.audit import AuditLog
    audit_log = AuditLog(
        company_id=company_id,
        user_id=user_id,
        action="ROLE_CHANGED",
        resource_type="company_member",
        resource_id=str(target.id),
        details={"new_role": new_role.name}
    )
    db.add(audit_log)
    
    await db.commit()
    
    # Evict cache
    from core.redis import get_redis_client
    redis_client = get_redis_client()
    try:
        await redis_client.delete(f"company:{company_id}:user:{target.user_id}:permissions")
    except Exception:
        pass
    
    return success_response(message=f"Role updated to {req.role_name}")

@router.delete("/{member_id}", dependencies=[Depends(require_company_permission(CAN_MANAGE_TEAM))])
async def remove_member(
    member_id: str,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Remove a team member from the company."""
    target_query = select(CompanyMember).where(
        CompanyMember.company_id == company_id,
        CompanyMember.id == member_id
    )
    result = await db.execute(target_query)
    target = result.scalars().first()
    
    if not target:
        raise HTTPException(status_code=404, detail="Member not found")
        
    await db.delete(target)
    
    # Audit log
    from models.audit import AuditLog
    audit_log = AuditLog(
        company_id=company_id,
        user_id=user_id,
        action="MEMBER_REMOVED",
        resource_type="company_member",
        resource_id=str(target.id)
    )
    db.add(audit_log)
    
    await db.commit()
    
    # Evict cache
    from core.redis import get_redis_client
    redis_client = get_redis_client()
    try:
        await redis_client.delete(f"company:{company_id}:user:{target.user_id}:permissions")
    except Exception:
        pass
    
    return success_response(message="Member removed successfully")

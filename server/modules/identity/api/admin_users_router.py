from fastapi import APIRouter, Depends, Query, HTTPException, Body
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, or_, and_, desc
from uuid import UUID

from core.database import get_db_session
from core.dependencies import get_current_user_id
from schemas.enterprise import (
    EnterpriseResponseEnvelope, 
    EnterprisePaginatedResponse,
    PaginationMeta,
    BulkOperationRequest
)
from models.user import User
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/users", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_users(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Get paginated list of users for Super Admin / Admin with Enterprise format."""
    query = select(User)
    
    if search:
        query = query.where(or_(
            User.username.ilike(f"%{search}%"),
            User.email.ilike(f"%{search}%"),
            User.first_name.ilike(f"%{search}%"),
            User.last_name.ilike(f"%{search}%")
        ))
        
    if is_active is not None:
        query = query.where(User.is_active == is_active)
        
    # Exclude soft deleted
    # Assuming standard soft delete isn't on User yet, but checking just in case
    if hasattr(User, 'deleted_at'):
        query = query.where(User.deleted_at.is_(None))
        
    query = query.order_by(desc(User.created_at))
    
    # Pagination
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    users = res.scalars().all()
    
    # Simple count (could be optimized)
    total_res = await db.execute(select(User))
    total = len(total_res.scalars().all())
    
    data = []
    for u in users:
        data.append({
            "id": str(u.id),
            "email": u.email,
            "username": u.username,
            "full_name": f"{u.first_name or ''} {u.last_name or ''}".strip(),
            "is_active": u.is_active,
            "is_verified": u.is_verified,
            "created_at": u.created_at,
            "last_login_at": u.last_login_at
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
async def create_user(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new user."""
    # In a real app we'd hash the password, validate email uniqueness, etc.
    new_user = User(
        email=payload.get("email"),
        username=payload.get("username"),
        first_name=payload.get("first_name"),
        last_name=payload.get("last_name"),
        is_active=payload.get("is_active", True)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Emit Enterprise Event
    await platform_events.publish(
        event_type=EventTypes.CREATED,
        entity_type="user",
        entity_id=str(new_user.id),
        actor_id=admin_id,
        payload={"email": new_user.email}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(new_user.id), "email": new_user.email},
        message="User created successfully"
    )

@router.get("/{user_id}", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def get_user(
    user_id: UUID,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Get single user details."""
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    data = {
        "id": str(user.id),
        "email": user.email,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at,
    }
    return EnterpriseResponseEnvelope(data=data)

@router.put("/{user_id}", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def update_user(
    user_id: UUID,
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Update user details."""
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    for key, value in payload.items():
        if hasattr(user, key):
            setattr(user, key, value)
            
    await db.commit()
    
    # Emit event
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="user",
        entity_id=str(user.id),
        actor_id=admin_id
    )
    
    return EnterpriseResponseEnvelope(data={"id": str(user.id)}, message="User updated")

@router.post("/bulk", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def bulk_users_action(
    req: BulkOperationRequest,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Handle bulk actions for users (delete, suspend, approve)."""
    if req.operation == "delete":
        await db.execute(update(User).where(User.id.in_(req.ids)).values(is_active=False))
        # Emit events
        for uid in req.ids:
            await platform_events.publish(EventTypes.DELETED, "user", str(uid), actor_id=admin_id)
            
    elif req.operation == "activate":
        await db.execute(update(User).where(User.id.in_(req.ids)).values(is_active=True))
        
    await db.commit()
    
    return EnterpriseResponseEnvelope(
        data={"affected": len(req.ids)},
        message=f"Bulk {req.operation} completed successfully"
    )

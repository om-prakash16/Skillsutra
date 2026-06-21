from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from uuid import UUID

from core.database import get_db_session
from core.dependencies import get_current_user_id
from schemas.enterprise import EnterprisePaginatedResponse
from models.security import LoginHistory
from models.user import User

router = APIRouter(prefix="/admin/login-history", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_login_history(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """View global login history and analytics."""
    query = select(LoginHistory, User).outerjoin(User, LoginHistory.user_id == User.id)
    
    if search:
        query = query.where(
            LoginHistory.ip_address.ilike(f"%{search}%") | 
            User.email.ilike(f"%{search}%")
        )
        
    if status:
        query = query.where(LoginHistory.status == status)
        
    if user_id:
        query = query.where(LoginHistory.user_id == UUID(user_id))
        
    query = query.order_by(desc(LoginHistory.login_time))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    records = res.all()
    
    # Need a separate count query since join makes it complex
    count_query = select(LoginHistory)
    if search:
        # Simplified count for global search
        pass 
    if status:
        count_query = count_query.where(LoginHistory.status == status)
    if user_id:
        count_query = count_query.where(LoginHistory.user_id == UUID(user_id))
        
    total_res = await db.execute(count_query)
    total = len(total_res.scalars().all())
    
    data = []
    for log, user in records:
        data.append({
            "id": str(log.id),
            "user": {
                "id": str(user.id) if user else str(log.user_id),
                "email": user.email if user else "Unknown"
            },
            "session_id": str(log.session_id) if log.session_id else None,
            "device_id": log.device_id,
            "ip_address": log.ip_address,
            "country": log.country,
            "city": log.city,
            "browser": log.browser,
            "os": log.os,
            "method": log.method,
            "mfa_used": log.mfa_used,
            "risk_score": log.risk_score,
            "status": log.status,
            "failure_reason": log.failure_reason,
            "login_time": log.login_time
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

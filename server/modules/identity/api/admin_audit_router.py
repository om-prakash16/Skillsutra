from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from uuid import UUID

from core.database import get_db_session
from core.dependencies import get_current_user_id
from schemas.enterprise import EnterprisePaginatedResponse
from models.audit import AuditLog
from models.user import User

router = APIRouter(prefix="/admin/audit-logs", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_audit_logs(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    trace_id: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """View global audit logs."""
    query = select(AuditLog, User).outerjoin(User, AuditLog.user_id == User.id)
    
    if search:
        query = query.where(
            AuditLog.action.ilike(f"%{search}%") | 
            AuditLog.resource_id.ilike(f"%{search}%") |
            User.email.ilike(f"%{search}%")
        )
        
    if resource_type:
        query = query.where(AuditLog.resource_type == resource_type.upper())
        
    if action:
        query = query.where(AuditLog.action == action.upper())
        
    if user_id:
        query = query.where(AuditLog.user_id == UUID(user_id))
        
    if trace_id:
        query = query.where(AuditLog.trace_id == trace_id)
        
    query = query.order_by(desc(AuditLog.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    records = res.all()
    
    count_query = select(AuditLog)
    if resource_type:
        count_query = count_query.where(AuditLog.resource_type == resource_type.upper())
    if action:
        count_query = count_query.where(AuditLog.action == action.upper())
    if user_id:
        count_query = count_query.where(AuditLog.user_id == UUID(user_id))
    if trace_id:
        count_query = count_query.where(AuditLog.trace_id == trace_id)
        
    total_res = await db.execute(count_query)
    total = len(total_res.scalars().all())
    
    data = []
    for log, user in records:
        data.append({
            "id": str(log.id),
            "user": {
                "id": str(user.id) if user else str(log.user_id),
                "email": user.email if user else "System/Unknown"
            },
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "details": log.details,
            "trace_id": log.trace_id,
            "correlation_id": log.correlation_id,
            "severity": log.severity,
            "ip_address": log.ip_address,
            "created_at": log.created_at
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

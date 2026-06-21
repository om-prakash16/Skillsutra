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
from models.iam import APIKey
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/api-keys", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_api_keys(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List API Keys."""
    query = select(APIKey)
    
    if search:
        query = query.where(APIKey.name.ilike(f"%{search}%"))
        
    query = query.order_by(desc(APIKey.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    keys = res.scalars().all()
    
    total_res = await db.execute(select(APIKey))
    total = len(total_res.scalars().all())
    
    data = []
    for k in keys:
        data.append({
            "id": str(k.id),
            "user_id": str(k.user_id) if k.user_id else None,
            "service_account_id": str(k.service_account_id) if k.service_account_id else None,
            "name": k.name,
            "prefix": k.prefix,
            "scopes": k.scopes,
            "last_used_at": k.last_used_at,
            "expires_at": k.expires_at,
            "is_active": k.is_active,
            "created_at": k.created_at
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
async def create_api_key(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new API Key."""
    import secrets
    import hashlib
    raw_key = "sk_live_" + secrets.token_hex(24)
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    
    new_key = APIKey(
        user_id=UUID(payload["user_id"]) if payload.get("user_id") else None,
        service_account_id=UUID(payload["service_account_id"]) if payload.get("service_account_id") else None,
        name=payload.get("name"),
        key_hash=key_hash,
        prefix=raw_key[:12],
        scopes=payload.get("scopes", ["read"])
    )
    db.add(new_key)
    await db.commit()
    await db.refresh(new_key)
    
    await platform_events.publish(
        event_type=EventTypes.CREATED,
        entity_type="api_key",
        entity_id=str(new_key.id),
        actor_id=admin_id,
        payload={"name": new_key.name}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(new_key.id), "raw_key": raw_key}, # Only time it's returned
        message="API Key created"
    )

@router.post("/{key_id}/revoke", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def revoke_api_key(
    key_id: UUID,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Revoke an API Key."""
    res = await db.execute(select(APIKey).where(APIKey.id == key_id))
    key = res.scalars().first()
    if not key:
        raise HTTPException(status_code=404, detail="Key not found")
        
    key.is_active = False
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="api_key",
        entity_id=str(key.id),
        actor_id=admin_id,
        payload={"action": "revoked"}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(key.id), "status": "revoked"},
        message="API Key revoked successfully"
    )

@router.post("/{key_id}/rotate", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def rotate_api_key(
    key_id: UUID,
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Rotate an API Key."""
    res = await db.execute(select(APIKey).where(APIKey.id == key_id))
    key = res.scalars().first()
    if not key:
        raise HTTPException(status_code=404, detail="Key not found")
        
    import secrets
    import hashlib
    raw_key = "sk_live_" + secrets.token_hex(24)
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    
    key.key_hash = key_hash
    key.prefix = raw_key[:12]
    
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="api_key",
        entity_id=str(key.id),
        actor_id=admin_id,
        payload={"action": "rotated"}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(key.id), "new_raw_key": raw_key},
        message="API Key rotated successfully"
    )

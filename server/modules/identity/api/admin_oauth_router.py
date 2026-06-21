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
from models.oauth import OAuthProviderConfig
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/oauth-apps", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_oauth_apps(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List OAuth Applications."""
    query = select(OAuthProviderConfig)
    
    if search:
        query = query.where(OAuthProviderConfig.display_name.ilike(f"%{search}%"))
        
    query = query.order_by(desc(OAuthProviderConfig.created_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    apps = res.scalars().all()
    
    total_res = await db.execute(select(OAuthProviderConfig))
    total = len(total_res.scalars().all())
    
    data = []
    for app in apps:
        data.append({
            "id": str(app.id),
            "name": app.name,
            "display_name": app.display_name,
            "client_id": app.client_id,
            "scopes": app.scopes,
            "redirect_uris": app.redirect_uris,
            "allowed_origins": app.allowed_origins,
            "is_active": app.is_active,
            "created_at": app.created_at
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
async def create_oauth_app(
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Register a new OAuth Provider (Google, GitHub, Custom)."""
    import hashlib
    secret_hash = hashlib.sha256(payload["client_secret"].encode()).hexdigest()
    
    new_app = OAuthProviderConfig(
        name=payload["name"],
        display_name=payload.get("display_name", payload["name"]),
        client_id=payload["client_id"],
        client_secret_hash=secret_hash,
        scopes=payload.get("scopes", []),
        redirect_uris=payload.get("redirect_uris", []),
        allowed_origins=payload.get("allowed_origins", [])
    )
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)
    
    await platform_events.publish(
        event_type=EventTypes.CREATED,
        entity_type="oauth_app",
        entity_id=str(new_app.id),
        actor_id=admin_id,
        payload={"provider_name": new_app.name}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(new_app.id)},
        message="OAuth Application registered"
    )

@router.post("/{app_id}/toggle", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def toggle_oauth_app(
    app_id: UUID,
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Enable or disable an OAuth provider."""
    res = await db.execute(select(OAuthProviderConfig).where(OAuthProviderConfig.id == app_id))
    app = res.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="OAuth App not found")
        
    is_active = payload.get("is_active", True)
    app.is_active = is_active
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="oauth_app",
        entity_id=str(app.id),
        actor_id=admin_id,
        payload={"action": "toggle", "is_active": is_active}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(app.id), "is_active": app.is_active},
        message=f"OAuth Application {'enabled' if is_active else 'disabled'}"
    )

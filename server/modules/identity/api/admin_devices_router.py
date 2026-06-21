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
from models.iam import Device
from core.events import platform_events, EventTypes

router = APIRouter(prefix="/admin/devices", tags=["Enterprise Identity"])

@router.get("", response_model=EnterprisePaginatedResponse[Dict[str, Any]])
async def list_devices(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """List all registered devices in the Enterprise Device Center."""
    query = select(Device)
    
    if search:
        query = query.where(Device.device_name.ilike(f"%{search}%") | Device.fingerprint.ilike(f"%{search}%"))
        
    query = query.order_by(desc(Device.last_active_at))
    
    offset = (page - 1) * size
    res = await db.execute(query.offset(offset).limit(size))
    devices = res.scalars().all()
    
    total_res = await db.execute(select(Device))
    total = len(total_res.scalars().all())
    
    data = []
    for d in devices:
        data.append({
            "id": str(d.id),
            "user_id": str(d.user_id),
            "device_name": d.device_name,
            "device_type": d.device_type,
            "os_name": d.os_name,
            "browser_name": d.browser_name,
            "fingerprint": d.fingerprint,
            "last_ip_address": d.last_ip_address,
            "last_location": d.last_location,
            "is_trusted": d.is_trusted,
            "is_blocked": d.is_blocked,
            "last_active_at": d.last_active_at,
            "created_at": d.created_at
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

@router.post("/{device_id}/trust", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def set_device_trust(
    device_id: UUID,
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Trust or Untrust a device."""
    res = await db.execute(select(Device).where(Device.id == device_id))
    device = res.scalars().first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    is_trusted = payload.get("is_trusted", False)
    device.is_trusted = is_trusted
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="device",
        entity_id=str(device.id),
        actor_id=admin_id,
        payload={"action": "trust_changed", "is_trusted": is_trusted}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(device.id), "is_trusted": device.is_trusted},
        message=f"Device marked as {'trusted' if is_trusted else 'untrusted'}"
    )

@router.post("/{device_id}/block", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def set_device_block(
    device_id: UUID,
    payload: Dict[str, Any] = Body(...),
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Block or Unblock a device."""
    res = await db.execute(select(Device).where(Device.id == device_id))
    device = res.scalars().first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    is_blocked = payload.get("is_blocked", True)
    device.is_blocked = is_blocked
    
    if is_blocked:
        device.is_trusted = False # Automatically untrust if blocked
        
    await db.commit()
    
    await platform_events.publish(
        event_type=EventTypes.UPDATED,
        entity_type="device",
        entity_id=str(device.id),
        actor_id=admin_id,
        payload={"action": "block_changed", "is_blocked": is_blocked}
    )
    
    return EnterpriseResponseEnvelope(
        data={"id": str(device.id), "is_blocked": device.is_blocked},
        message=f"Device {'blocked' if is_blocked else 'unblocked'}"
    )

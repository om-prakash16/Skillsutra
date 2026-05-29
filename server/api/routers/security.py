from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import uuid
from typing import List, Dict, Any

from core.database import get_db_session as get_db
from modules.auth.core.service import get_current_user
from models.user import User
from services.security_service import SecurityService
import schemas.security as schemas # Assuming we will create these Pydantic schemas

router = APIRouter(prefix="/security", tags=["Security Center"])

def get_security_service(db: Session = Depends(get_db)):
    return SecurityService(db)

# ---------------------------------------------------------
# DEVICES
# ---------------------------------------------------------
@router.get("/devices", response_model=List[Dict[str, Any]])
async def get_trusted_devices(
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    devices = service.get_trusted_devices(current_user.id)
    return devices

@router.delete("/devices/{device_id}")
async def revoke_device(
    device_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    service.revoke_device(current_user.id, device_id)
    return {"message": "Device revoked successfully"}

# ---------------------------------------------------------
# SESSIONS
# ---------------------------------------------------------
@router.get("/sessions", response_model=List[Dict[str, Any]])
async def get_active_sessions(
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    sessions = service.get_active_sessions(current_user.id)
    return sessions

@router.delete("/sessions/{session_id}")
async def revoke_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    service.revoke_session(current_user.id, session_id)
    return {"message": "Session revoked successfully"}

# ---------------------------------------------------------
# HISTORY & EVENTS
# ---------------------------------------------------------
@router.get("/history", response_model=List[Dict[str, Any]])
async def get_login_history(
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    return service.get_login_history(current_user.id)

@router.get("/events", response_model=List[Dict[str, Any]])
async def get_security_events(
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    return service.get_security_events(current_user.id)

@router.get("/score")
async def get_security_score(
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    score = service.calculate_security_score(current_user.id)
    return {"score": score}

# ---------------------------------------------------------
# PRIVACY SETTINGS
# ---------------------------------------------------------
@router.get("/privacy", response_model=Dict[str, Any])
async def get_privacy_settings(
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    settings = service.get_privacy_settings(current_user.id)
    return {
        "profile_visibility": settings.profile_visibility,
        "show_email": settings.show_email,
        "show_location": settings.show_location,
        "search_visibility": settings.search_visibility,
        "discovery_visibility": settings.discovery_visibility,
    }

@router.patch("/privacy", response_model=Dict[str, Any])
async def update_privacy_settings(
    request: Request,
    current_user: User = Depends(get_current_user),
    service: SecurityService = Depends(get_security_service)
):
    data = await request.json()
    settings = service.update_privacy_settings(current_user.id, data)
    return {
        "profile_visibility": settings.profile_visibility,
        "show_email": settings.show_email,
        "show_location": settings.show_location,
        "search_visibility": settings.search_visibility,
        "discovery_visibility": settings.discovery_visibility,
    }

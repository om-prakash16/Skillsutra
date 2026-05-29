from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional, List, Dict, Any

# Trusted Devices
class TrustedDeviceBase(BaseModel):
    device_name: str
    device_fingerprint: str
    last_ip_address: str

class TrustedDeviceCreate(TrustedDeviceBase):
    pass

class TrustedDeviceOut(TrustedDeviceBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    last_used_at: datetime

    class Config:
        orm_mode = True

# Login History
class LoginHistoryOut(BaseModel):
    id: UUID4
    user_id: UUID4
    ip_address: str
    user_agent: str
    location: str
    status: str
    failure_reason: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

# Security Events
class SecurityEventOut(BaseModel):
    id: UUID4
    user_id: UUID4
    event_type: str
    severity: str
    description: str
    ip_address: str
    created_at: datetime

    class Config:
        orm_mode = True

# Privacy Settings
class PrivacySettingsUpdate(BaseModel):
    profile_visibility: Optional[str] = None
    show_email: Optional[bool] = None
    show_location: Optional[bool] = None
    search_visibility: Optional[bool] = None
    discovery_visibility: Optional[bool] = None

class PrivacySettingsOut(BaseModel):
    profile_visibility: str
    show_email: bool
    show_location: bool
    search_visibility: bool
    discovery_visibility: bool

    class Config:
        orm_mode = True

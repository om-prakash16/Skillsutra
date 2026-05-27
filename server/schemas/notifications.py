from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID

class ChannelPreferences(BaseModel):
    email: bool = True
    push: bool = True
    in_app: bool = True
    websocket: bool = True

class QuietHours(BaseModel):
    start: str = "22:00"
    end: str = "08:00"
    timezone: str = "UTC"

class NotificationPreferencesUpdate(BaseModel):
    channels: Optional[ChannelPreferences] = None
    categories: Optional[Dict[str, Any]] = None
    quiet_hours: Optional[QuietHours] = None
    frequency: Optional[str] = Field(None, description="IMMEDIATE, DAILY_DIGEST, WEEKLY_DIGEST")

class NotificationPreferencesResponse(BaseModel):
    user_id: UUID
    channels: Dict[str, bool]
    categories: Dict[str, Any]
    quiet_hours: Dict[str, str]
    frequency: str
    
    class Config:
        from_attributes = True

class UserMuteCreate(BaseModel):
    target_type: str = Field(..., description="COMPANY, USER, COMMUNITY")
    target_id: UUID

class NotificationResponse(BaseModel):
    id: UUID
    type: str
    title: str
    body: Optional[str]
    action_url: Optional[str]
    metadata_json: Dict[str, Any]
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

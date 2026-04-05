from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional, Dict, Any, List
from datetime import datetime

class NotificationPrefs(BaseModel):
    application_updates: bool = True
    ai_recommendations: bool = True
    skill_verification: bool = True
    interview_requests: bool = True

class JobPrefs(BaseModel):
    target_roles: List[str] = []
    expected_salary: Optional[str] = None
    preferred_location: str = "remote"
    job_type: str = "full-time"

class UserSettingsUpdate(BaseModel):
    profile_visibility: Optional[str] = None
    notification_prefs: Optional[NotificationPrefs] = None
    job_prefs: Optional[JobPrefs] = None
    privacy_rules: Optional[Dict[str, str]] = None

class UserSettingsResponse(BaseModel):
    user_id: UUID
    profile_visibility: str
    notification_prefs: NotificationPrefs
    job_prefs: JobPrefs
    privacy_rules: Dict[str, str]
    updated_at: datetime

    class Config:
        from_attributes = True

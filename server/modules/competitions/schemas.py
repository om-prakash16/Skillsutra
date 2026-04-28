from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class CompetitionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    comp_type: str  # 'hackathon', 'bounty', 'grant'
    skills_required: Optional[List[str]] = []
    deadline: Optional[datetime] = None
    url: Optional[str] = None

class CompetitionResponse(CompetitionCreate):
    id: UUID
    status: str
    created_by: Optional[UUID]
    created_at: datetime

class UserPreferenceUpdate(BaseModel):
    interested_types: Optional[List[str]] = []
    preferred_skills: Optional[List[str]] = []
    receive_notifications: Optional[bool] = True

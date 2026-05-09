from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class JobBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10)
    location: str
    type: str = Field(..., description="e.g. Full-time, Remote, Contract")
    salary_range: Optional[str] = None
    experience_level: Optional[str] = None
    tags: List[str] = []
    requirements: List[str] = []

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    salary_range: Optional[str] = None
    experience_level: Optional[str] = None
    tags: Optional[List[str]] = None
    requirements: Optional[List[str]] = None

class JobResponse(JobBase):
    id: str
    company_id: str
    created_at: datetime
    created_by: str
    is_active: bool = True

    class Config:
        from_attributes = True

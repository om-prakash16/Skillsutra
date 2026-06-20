from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class ExperienceBase(BaseModel):
    company_name: str
    title: str
    location: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: bool = False
    description: Optional[str] = None

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: UUID
    profile_id: UUID

    class Config:
        from_attributes = True

class EducationBase(BaseModel):
    school: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None

class EducationCreate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: UUID
    profile_id: UUID

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    github_url: Optional[str] = None
    skills_used: List[str] = []

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: UUID
    profile_id: UUID

    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    headline: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None
    resume_url: Optional[str] = None
    banner_url: Optional[str] = None
    visibility_mode: str = "PUBLIC"
    open_to_work: bool = False
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    experiences: List[ExperienceResponse] = []
    educations: List[EducationResponse] = []
    projects: List[ProjectResponse] = []

    class Config:
        from_attributes = True

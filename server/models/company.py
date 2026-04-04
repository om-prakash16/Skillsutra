from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None
    about_company: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: str
    owner_wallet: str
    is_verified: bool
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class JobSchemaFieldResponse(BaseModel):
    id: str
    label: str
    key: str
    type: str
    required: bool
    placeholder: Optional[str] = None
    options: Optional[List[str]] = None
    validation_rules: Optional[Dict[str, Any]] = None
    default_value: Optional[str] = None
    section_name: str
    display_order: int

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    description: str
    required_skills: List[str] = []
    employment_type: Optional[str] = None
    location_type: Optional[str] = None
    salary_range: Optional[str] = None
    deadline: Optional[datetime] = None
    min_reputation_score: int = 0
    dynamic_fields: Dict[str, Any] = {}

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: str
    company_id: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TalentBookmarkBase(BaseModel):
    candidate_wallet: str
    notes: Optional[str] = None

class TalentBookmarkCreate(TalentBookmarkBase):
    pass

class TalentBookmarkResponse(TalentBookmarkBase):
    id: str
    company_id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime
import uuid


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


class AssessmentQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question_text: str
    options: List[str]
    correct_option_index: int
    points: int = 10


class JobBase(BaseModel):
    title: str
    description: str
    required_skills: List[str] = []
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: str = "remote"  # remote | onsite | hybrid
    employment_type: str = "full-time"  # full-time | part-time | contract | internship
    deadline: Optional[datetime] = None
    min_reputation_score: int = 0
    assessment_questions: List[AssessmentQuestion] = []
    dynamic_fields: Dict[str, Any] = {}


class JobCreate(JobBase):
    company_id: str


class JobResponse(JobBase):
    id: str
    company_id: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: Optional[str] = None
    employment_type: Optional[str] = None
    deadline: Optional[datetime] = None
    min_reputation_score: Optional[int] = None
    dynamic_fields: Optional[Dict[str, Any]] = None


class JobApplicationRequest(BaseModel):
    job_id: str
    candidate_wallet: str


class JobApplicationResponse(BaseModel):
    id: str
    status: str
    ai_match_score: float
    assessment_score: Optional[float] = None


class ApplicationBase(BaseModel):
    job_id: str
    candidate_id: str


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationResponse(ApplicationBase):
    id: str
    status: str  # applied | shortlisted | interview | hired | rejected
    ai_match_score: float
    assessment_score: Optional[float] = None
    assessment_results: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobSchemaFieldResponse(BaseModel):
    id: str
    label: str
    key: str
    field_type: str
    required: bool
    section_name: str
    display_order: int

    class Config:
        from_attributes = True

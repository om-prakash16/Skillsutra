from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime

class ResumeBase(BaseModel):
    title: str = Field(..., example="Frontend Developer Resume")
    is_primary: Optional[bool] = False
    template_id: Optional[str] = "modern"
    design_settings: Optional[Dict[str, Any]] = {}
    content: Optional[Dict[str, Any]] = {}

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    is_primary: Optional[bool] = None
    template_id: Optional[str] = None
    design_settings: Optional[Dict[str, Any]] = None
    content: Optional[Dict[str, Any]] = None

class ResumeResponse(ResumeBase):
    id: UUID
    user_id: UUID
    ats_score: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ResumeVersionResponse(BaseModel):
    id: UUID
    resume_id: UUID
    version_hash: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class AISectionRewriteRequest(BaseModel):
    section_content: str
    target_job_description: Optional[str] = None
    focus: Optional[str] = "impact" # impact, grammar, keywords

class AISectionRewriteResponse(BaseModel):
    rewritten_content: str
    suggestions: List[str] = []

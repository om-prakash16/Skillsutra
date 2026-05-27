from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class CoverLetterBase(BaseModel):
    title: str = Field(..., example="Software Engineer Cover Letter")
    resume_id: Optional[UUID] = None
    job_id: Optional[UUID] = None
    content_markdown: Optional[str] = None
    tone: Optional[str] = "PROFESSIONAL"
    status: Optional[str] = "DRAFT"

class CoverLetterCreate(CoverLetterBase):
    pass

class CoverLetterUpdate(BaseModel):
    title: Optional[str] = None
    content_markdown: Optional[str] = None
    tone: Optional[str] = None
    status: Optional[str] = None

class CoverLetterResponse(CoverLetterBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AIGenerateRequest(BaseModel):
    resume_id: UUID
    job_id: Optional[UUID] = None
    job_description_text: Optional[str] = None
    tone: Optional[str] = "PROFESSIONAL"

class AIRewriteRequest(BaseModel):
    content_markdown: str
    tone: Optional[str] = None
    focus: Optional[str] = "grammar" # grammar, tone, impact

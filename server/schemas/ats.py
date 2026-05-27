from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID

class StageCreate(BaseModel):
    name: str = Field(..., description="Stage name (e.g., APPLIED, TECHNICAL_SCREEN)")
    order_index: float

class ApplicationMove(BaseModel):
    new_stage_id: UUID
    reason: Optional[str] = Field(None, description="Reason for moving the candidate")

class ApplicationNoteCreate(BaseModel):
    content: str
    visibility: str = Field("TEAM", description="TEAM or PRIVATE")

class InterviewCreate(BaseModel):
    interviewer_ids: List[UUID]
    scheduled_at: datetime
    type: str = Field("TECHNICAL", description="e.g., BEHAVIORAL, TECHNICAL")
    meeting_link: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: UUID
    job_id: UUID
    candidate_id: UUID
    current_stage_id: Optional[UUID]
    status: str
    ai_match_score: Optional[float]
    ats_score: Optional[float]
    metadata: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AtsAuditLogResponse(BaseModel):
    id: UUID
    actor_id: Optional[UUID]
    action: str
    previous_state: Dict[str, Any]
    new_state: Dict[str, Any]
    timestamp: datetime
    
    class Config:
        from_attributes = True

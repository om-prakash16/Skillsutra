from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class SaveTalentRequest(BaseModel):
    talent_id: UUID
    notes: Optional[str] = None

class SavedTalentResponse(BaseModel):
    id: UUID
    company_id: UUID
    user_id: UUID
    notes: Optional[str]

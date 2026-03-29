from pydantic import BaseModel
from typing import List, Optional

class ProfileData(BaseModel):
    resume_text: str

class MatchRequest(BaseModel):
    profile_skills: List[str]
    job_description: str

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class AIAnalysisRequest(BaseModel):
    user_id: str

class SkillGapRequest(BaseModel):
    user_id: str
    target_role: str

class AIAnalysisResponse(BaseModel):
    strengths: List[str]
    missing_skills: List[str]
    recommendations: List[str]

class AIScoreResponse(BaseModel):
    user_id: str
    skill_score: float
    project_score: float
    experience_score: float
    proof_score: float

class SkillGapResponse(BaseModel):
    missing_skills: List[str]
    learning_roadmap: List[str]

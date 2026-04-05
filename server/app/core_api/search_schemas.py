from pydantic import BaseModel, Field
from uuid import UUID
from typing import List, Optional, Dict, Any

class CandidateSearchQuery(BaseModel):
    skills: Optional[List[str]] = None
    min_score: Optional[int] = 0
    location: Optional[str] = None
    experience_tier: Optional[str] = None # 'entry', 'mid', 'senior'
    keyword: Optional[str] = None
    limit: Optional[int] = 20
    offset: Optional[int] = 0

class JobSearchQuery(BaseModel):
    title: Optional[str] = None
    skills: Optional[List[str]] = None
    min_salary: Optional[int] = None
    job_type: Optional[str] = None
    keyword: Optional[str] = None
    limit: Optional[int] = 20
    offset: Optional[int] = 0

class CandidateSearchResult(BaseModel):
    user_id: UUID
    username: str
    reputation_score: int
    skills: List[str]
    experience_count: int
    bio: Optional[str] = None
    similarity_score: Optional[float] = None

class JobSearchResult(BaseModel):
    id: UUID
    title: str
    salary_range: Optional[str] = None
    job_type: str
    required_skills: List[str]
    created_at: str
    ai_match_score: Optional[float] = 100.0

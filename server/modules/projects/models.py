"""
Project Ledger — Pydantic Models.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    role: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    stack: List[str] = []
    metadata: Dict[str, Any] = {}

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    role: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    stack: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class ProjectResponse(ProjectBase):
    id: UUID
    user_id: UUID
    is_ai_verified: bool = False
    integrity_score: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True

class SkillLinkRequest(BaseModel):
    skill_ids: List[UUID]
    usage_context: Optional[str] = None
    contribution_weight: float = 1.0

class GitHubRepoImport(BaseModel):
    repo_name: str
    github_url: str
    description: Optional[str] = None
    language: Optional[str] = None
    topics: List[str] = []

from pydantic import BaseModel, Field, constr
from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID
import re

def validate_username_slug(slug: str) -> str:
    if not re.match(r"^[a-zA-Z0-9_-]{3,30}$", slug):
        raise ValueError("Username must be 3-30 characters and contain only letters, numbers, underscores, and dashes.")
    return slug.lower()

class UsernameClaim(BaseModel):
    username: str = Field(..., description="The requested username slug")

class VisibilitySettingsUpdate(BaseModel):
    profile_visibility: Optional[str] = Field(None, description="PUBLIC, PRIVATE, RECRUITER_ONLY")
    resume_visibility: Optional[str] = Field(None, description="PUBLIC, PRIVATE, RECRUITER_ONLY")
    portfolio_visibility: Optional[str] = Field(None, description="PUBLIC, PRIVATE, RECRUITER_ONLY")
    social_visibility: Optional[str] = Field(None, description="PUBLIC, PRIVATE, RECRUITER_ONLY")

class PortfolioProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    github_repo_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    architecture_writeup: Optional[str] = None
    is_featured: bool = False

class PublicProfileResponse(BaseModel):
    username: str
    is_verified: bool
    headline: Optional[str]
    bio: Optional[str]
    skills: List[Dict[str, Any]]
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    social_links: Dict[str, Any]
    projects: List[Dict[str, Any]]
    
    # Injected dynamically only if viewer is a recruiter
    recruiter_ai_recommendation: Optional[str] = None
    
    class Config:
        from_attributes = True

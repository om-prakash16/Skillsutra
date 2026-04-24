"""
Skill Graph System — Pydantic Models.
Request/Response schemas for the enterprise skill graph API.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class SkillCategory(str, Enum):
    LANGUAGE = "language"
    FRAMEWORK = "framework"
    TOOL = "tool"
    DATABASE = "database"
    CLOUD = "cloud"
    CONCEPT = "concept"
    AI_ML = "ai_ml"
    SOFT_SKILL = "soft_skill"


class ProficiencyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class SkillSource(str, Enum):
    SELF_CLAIMED = "self_claimed"
    AI_EXTRACTED = "ai_extracted"
    GITHUB_VERIFIED = "github_verified"
    QUIZ_VERIFIED = "quiz_verified"
    PEER_ENDORSED = "peer_endorsed"


class ImportanceLevel(str, Enum):
    REQUIRED = "required"
    PREFERRED = "preferred"
    NICE_TO_HAVE = "nice_to_have"


class RelationshipType(str, Enum):
    PARENT = "parent"
    RELATED = "related"
    PREREQUISITE = "prerequisite"
    ALTERNATIVE = "alternative"


# ── Taxonomy ──

class TaxonomyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    category: SkillCategory = SkillCategory.TOOL
    parent_id: Optional[str] = None
    description: Optional[str] = None
    icon_url: Optional[str] = None


class TaxonomyUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[SkillCategory] = None
    description: Optional[str] = None
    icon_url: Optional[str] = None


class TaxonomyResponse(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    parent_id: Optional[str] = None
    description: Optional[str] = None
    icon_url: Optional[str] = None
    popularity_score: int = 0
    is_verified: bool = True


# ── User Skill Nodes ──

class AddSkillRequest(BaseModel):
    skill_id: str
    proficiency_level: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    years_experience: float = 0
    is_primary: bool = False
    last_used_at: Optional[str] = None


class UpdateSkillRequest(BaseModel):
    proficiency_level: Optional[ProficiencyLevel] = None
    years_experience: Optional[float] = None
    is_primary: Optional[bool] = None
    last_used_at: Optional[str] = None


class BulkAddSkillsRequest(BaseModel):
    skills: List[AddSkillRequest]


class UserSkillNodeResponse(BaseModel):
    id: str
    skill_id: str
    skill_name: Optional[str] = None
    skill_category: Optional[str] = None
    proficiency_level: str
    proficiency_score: float = 0.0
    proof_score: float = 0.0
    source: str = "self_claimed"
    ai_confidence: Optional[float] = None
    years_experience: float = 0
    is_primary: bool = False
    is_verified: bool = False
    endorsement_count: Optional[int] = 0
    projects: Optional[List[Dict[str, Any]]] = []
    created_at: Optional[str] = None


# ── Graph Intelligence ──

class SkillMatchRequest(BaseModel):
    candidate_skills: List[str]
    required_skills: List[str]
    proof_score: Optional[int] = 500


class SkillMatchResponse(BaseModel):
    match_percentage: float
    fit_tier: str
    direct_keyword_matches: List[str]
    graph_semantic_matches: Dict[str, float]
    missing_critical_skills: List[str]
    proof_score_bonus: float
    recommendation: str


class SkillGapResponse(BaseModel):
    job_title: Optional[str] = None
    required_skills: List[Dict[str, Any]]
    user_skills: List[Dict[str, Any]]
    matched: List[Dict[str, Any]]
    gaps: List[Dict[str, Any]]
    gap_score: float
    recommendations: List[str]


# ── AI Extraction ──

class ExtractResumeRequest(BaseModel):
    resume_text: str


class ExtractGitHubRequest(BaseModel):
    github_username: str


class ExtractedSkill(BaseModel):
    skill_name: str
    category: str
    proficiency_estimate: str
    confidence: float
    evidence: str = ""
    matched_taxonomy_id: Optional[str] = None


class ExtractConfirmRequest(BaseModel):
    confirmed_skills: List[Dict[str, Any]]


# ── Endorsements ──

class EndorseSkillRequest(BaseModel):
    user_skill_node_id: str
    relationship: Optional[str] = "colleague"
    comment: Optional[str] = None


# ── Job Skill Requirements ──

class JobSkillRequirementCreate(BaseModel):
    job_id: str
    skill_id: str
    importance: ImportanceLevel = ImportanceLevel.REQUIRED
    min_proficiency: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    min_years: float = 0

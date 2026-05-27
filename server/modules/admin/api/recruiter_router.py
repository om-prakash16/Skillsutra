from fastapi import APIRouter, Depends, HTTPException, Query, Body
from typing import Dict, Any, List
from core.response import success_response
from modules.auth.core.dependencies import RoleChecker
from core.dependencies import get_db, get_company_id

router = APIRouter(prefix="/recruiter", tags=["Enterprise Recruiter"])

# Create a reusable dependency for recruiter routes
require_recruiter = RoleChecker(["RECRUITER", "SUPER_ADMIN"])
require_company_or_admin = RoleChecker(["COMPANY", "ADMIN", "SUPER_ADMIN"])

@router.post("/search")
async def search_candidates(
    query: str = Body(..., embed=True),
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_recruiter)
):
    """
    Hybrid Search for candidates using ElasticSearch / pgvector.
    Translates Natural Language to a Vector + Filtered search.
    """
    # Mock search logic
    # In production, this interacts with Elasticsearch/OpenSearch + pgvector
    results = [
        {
            "candidate_id": "uuid-1",
            "name": "Jane Doe",
            "match_score": 92.5,
            "headline": "Senior Backend Developer (FastAPI, Redis)",
            "matched_skills": ["FastAPI", "Redis", "Docker"]
        },
        {
            "candidate_id": "uuid-2",
            "name": "John Smith",
            "match_score": 85.0,
            "headline": "Fullstack Engineer",
            "matched_skills": ["PostgreSQL", "Docker"]
        }
    ]
    
    return success_response(data={"query": query, "results": results, "total": 2})

@router.post("/talent-pools")
async def create_talent_pool(
    name: str = Body(..., embed=True),
    description: str = Body(None, embed=True),
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_company_or_admin)
):
    """Create a new Talent Pool (CRM)."""
    pool = {
        "id": "uuid-pool-1",
        "company_id": company_id,
        "name": name,
        "description": description
    }
    return success_response(data=pool, message="Talent Pool created")

@router.get("/talent-pools")
async def list_talent_pools(
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_company_or_admin)
):
    """List all Talent Pools for a company."""
    pools = []
    return success_response(data=pools)

@router.post("/talent-pools/{pool_id}/members")
async def add_candidate_to_pool(
    pool_id: str,
    candidate_id: str = Body(..., embed=True),
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_company_or_admin)
):
    """Add a candidate to a talent pool for nurturing."""
    member = {
        "pool_id": pool_id,
        "candidate_id": candidate_id,
        "status": "NURTURING"
    }
    return success_response(data=member, message="Candidate added to Talent Pool")

@router.get("/jobs/{job_id}/matches")
async def get_job_matches(
    job_id: str,
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_company_or_admin)
):
    """AI Ranking engine returning the best candidates for a specific Job."""
    # Placeholder for hybrid matching algorithm
    matches = [
        {
            "candidate_id": "uuid-3",
            "name": "Sarah Connor",
            "overall_score": 98.2,
            "breakdown": {
                "vector_match": 95,
                "skill_verification": 100,
                "platform_activity": 80
            }
        }
    ]
    return success_response(data=matches)

@router.get("/branding")
async def get_employer_branding(
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_company_or_admin)
):
    """Retrieve employer branding settings for the company."""
    branding = {
        "company_id": company_id,
        "culture_description": "We are a fast-paced AI startup.",
        "tech_stack": ["FastAPI", "React", "Docker"],
        "media_gallery": []
    }
    return success_response(data=branding)

@router.post("/branding")
async def update_employer_branding(
    payload: dict = Body(...),
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_company_or_admin)
):
    """Update employer branding settings."""
    payload["company_id"] = company_id
    return success_response(data=payload, message="Employer branding updated successfully")

@router.post("/applications/{app_id}/notes")
async def add_application_note(
    app_id: str,
    payload: dict = Body(...),
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_company_or_admin)
):
    """Add a private note to a candidate's application in the ATS."""
    note = {
        "id": "uuid-note-1",
        "application_id": app_id,
        "content": payload.get("content"),
        "visibility": "TEAM"
    }
    return success_response(data=note, message="Application note added")

@router.get("/analytics/funnel")
async def get_hiring_funnel_analytics(
    company_id: str = Depends(get_company_id),
    auth_guard = Depends(require_company_or_admin)
):
    """Retrieve high-level hiring metrics and funnel analytics."""
    analytics = {
        "time_to_hire_days": 18.5,
        "funnel": {
            "applied": 1500,
            "screening": 450,
            "assessment": 200,
            "interview": 50,
            "offer": 15,
            "hired": 12
        },
        "source_effectiveness": {
            "linkedin": 40,
            "organic": 35,
            "referral": 25
        }
    }
    return success_response(data=analytics)

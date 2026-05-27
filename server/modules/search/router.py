"""
Enterprise Search Router.
Provides 7 unified search and discovery endpoints for the platform.
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional, List, Dict, Any
from core.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from core.response import success_response
from modules.search.service import SearchService
from modules.auth.core.service import get_current_user

router = APIRouter()
search_service = SearchService()

# ──────────────────────────────────────────────
# CORE SEARCH ENDPOINTS
# ──────────────────────────────────────────────

@router.get("/talent")
async def search_talent(
    query: Optional[str] = Query(None, description="Search keyword"),
    skills: Optional[str] = Query(None, description="Comma-separated skills"),
    location: Optional[str] = Query(None, description="Location filter"),
    open_to_work: Optional[bool] = Query(None, description="Filter open to work"),
    min_reputation: Optional[float] = Query(None, description="Minimum reputation score"),
    experience_level: Optional[str] = Query(None, description="Experience level filter"),
    sort: str = Query("relevance", description="relevance, newest, reputation"),
    cursor: Optional[str] = Query(None, description="Pagination cursor"),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Multi-filter talent search with hybrid AI ranking."""
    skill_list = skills.split(",") if skills else None
    result = await search_service.search_talent(
        db=db,
        query=query,
        skills=skill_list,
        location=location,
        open_to_work=open_to_work,
        min_reputation=min_reputation,
        experience_level=experience_level,
        sort=sort,
        cursor=cursor,
        limit=limit
    )
    return success_response(data=result)

@router.get("/jobs")
async def search_jobs(
    query: Optional[str] = Query(None, description="Search keyword"),
    skills: Optional[str] = Query(None, description="Comma-separated skills"),
    location: Optional[str] = Query(None, description="Location filter"),
    remote_only: Optional[bool] = Query(None, description="Filter remote only jobs"),
    min_salary: Optional[int] = Query(None, description="Minimum salary filter"),
    sort: str = Query("relevance", description="relevance, newest"),
    cursor: Optional[str] = Query(None, description="Pagination cursor"),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """Personalized job discovery with AI ranking."""
    skill_list = skills.split(",") if skills else None
    
    # In a full implementation, we would fetch user_prefs here based on current_user
    user_prefs = {"remote_preference": "REMOTE"} if remote_only else {}
    
    result = await search_service.search_jobs(
        db=db,
        query=query,
        skills=skill_list,
        location=location,
        remote_only=remote_only,
        min_salary=min_salary,
        sort=sort,
        cursor=cursor,
        limit=limit,
        user_prefs=user_prefs
    )
    return success_response(data=result)

@router.get("/communities")
async def search_communities(
    query: Optional[str] = Query(None, description="Search keyword"),
    industry: Optional[str] = Query(None, description="Industry filter"),
    sort: str = Query("relevance", description="relevance, newest"),
    cursor: Optional[str] = Query(None, description="Pagination cursor"),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Search communities and forum groups."""
    result = await search_service.search_communities(
        db=db, query=query, industry=industry, sort=sort, cursor=cursor, limit=limit
    )
    return success_response(data=result)

@router.get("/projects")
async def search_projects(
    query: Optional[str] = Query(None, description="Search keyword"),
    tech_stack: Optional[str] = Query(None, description="Comma-separated tech stack"),
    sort: str = Query("relevance", description="relevance, newest"),
    cursor: Optional[str] = Query(None, description="Pagination cursor"),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Search portfolios and projects."""
    stack_list = tech_stack.split(",") if tech_stack else None
    result = await search_service.search_projects(
        db=db, query=query, tech_stack=stack_list, sort=sort, cursor=cursor, limit=limit
    )
    return success_response(data=result)

@router.get("/gigs")
async def search_gigs(
    query: Optional[str] = Query(None, description="Search keyword"),
    min_budget: Optional[int] = Query(None, description="Minimum budget"),
    max_budget: Optional[int] = Query(None, description="Maximum budget"),
    sort: str = Query("relevance", description="relevance, newest"),
    cursor: Optional[str] = Query(None, description="Pagination cursor"),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Search freelance gigs and contracts."""
    result = await search_service.search_gigs(
        db=db, query=query, min_budget=min_budget, max_budget=max_budget,
        sort=sort, cursor=cursor, limit=limit
    )
    return success_response(data=result)

# ──────────────────────────────────────────────
# AUTOCOMPLETE & DISCOVERY ENDPOINTS
# ──────────────────────────────────────────────

@router.get("/autocomplete")
async def search_autocomplete(
    q: str = Query(..., min_length=1, description="Prefix to autocomplete"),
    types: Optional[str] = Query(None, description="Comma-separated entity types (skills, jobs, companies, users)"),
    limit: int = Query(10, ge=1, le=20)
):
    """Cross-entity type-ahead suggestions backed by Redis."""
    entity_types = types.split(",") if types else ["skills", "jobs", "companies", "users"]
    result = await search_service.autocomplete(prefix=q, entity_types=entity_types, limit=limit)
    return success_response(data={"suggestions": result})

@router.get("/trending")
async def get_trending(
    type: str = Query("posts", description="Entity type to find trending for: posts, jobs, skills"),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Find trending items based on engagement velocity and time decay."""
    result = await search_service.get_trending(db=db, entity_type=type, limit=limit)
    return success_response(data={"trending": result})

@router.get("/recommendations")
async def get_recommendations(
    type: str = Query("jobs", description="jobs, people, gigs, communities"),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get personalized recommendations using AI embeddings and skill graph."""
    user_id = current_user.get("sub") or current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required for recommendations")
        
    result = await search_service.get_recommendations(db=db, user_id=user_id, entity_type=type, limit=limit)
    return success_response(data={"recommendations": result})

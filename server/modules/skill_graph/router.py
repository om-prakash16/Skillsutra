"""
Skill Graph Router — 18 enterprise-grade API endpoints.
Covers: taxonomy CRUD, user skill graph management, graph intelligence,
AI extraction, endorsements, and job skill requirements.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
from modules.auth.core.service import get_current_user
from modules.auth.core.guards import require_admin
from modules.skill_graph.service import SkillGraphService
from modules.skill_graph.graph_engine import GraphEngine
from modules.skill_graph.models import (
    TaxonomyCreate, TaxonomyUpdate, AddSkillRequest, UpdateSkillRequest,
    BulkAddSkillsRequest, SkillMatchRequest, ExtractResumeRequest,
    ExtractGitHubRequest, ExtractConfirmRequest, EndorseSkillRequest,
)

router = APIRouter()
service = SkillGraphService()
graph = GraphEngine()


# ═══════════════════════════════════════════════
#  TAXONOMY ENDPOINTS (Admin + Public Read)
# ═══════════════════════════════════════════════

@router.get("/taxonomy")
async def list_taxonomy(
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """List all skills in the taxonomy (public, paginated)."""
    return await service.taxonomy.list_skills(category=category, page=page, page_size=page_size)


@router.get("/taxonomy/search")
async def search_taxonomy(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, ge=1, le=100),
):
    """Fuzzy search the skill taxonomy."""
    results = await service.taxonomy.search_skills(q, limit=limit)
    return {"query": q, "results": results, "count": len(results)}


@router.post("/taxonomy")
async def create_taxonomy_entry(
    data: TaxonomyCreate,
    admin=Depends(require_admin),
):
    """Add a new skill to the taxonomy (admin only)."""
    return await service.taxonomy.create_skill(data.model_dump(exclude_none=True))


@router.put("/taxonomy/{skill_id}")
async def update_taxonomy_entry(
    skill_id: str,
    data: TaxonomyUpdate,
    admin=Depends(require_admin),
):
    """Update a taxonomy entry (admin only)."""
    return await service.taxonomy.update_skill(skill_id, data.model_dump(exclude_none=True))


@router.delete("/taxonomy/{skill_id}")
async def delete_taxonomy_entry(
    skill_id: str,
    admin=Depends(require_admin),
):
    """Remove a taxonomy entry (admin only)."""
    return await service.taxonomy.delete_skill(skill_id)


# ═══════════════════════════════════════════════
#  USER SKILL GRAPH ENDPOINTS
# ═══════════════════════════════════════════════

@router.get("/me")
async def get_my_skills(current_user=Depends(get_current_user)):
    """Get the authenticated user's full skill graph."""
    user_id = current_user.get("sub") or current_user.get("id")
    return await service.get_user_skill_graph(user_id)


@router.get("/user/{user_id}")
async def get_user_skills(user_id: str):
    """Get a user's public skill graph."""
    return await service.get_user_skill_graph(user_id)


@router.post("/me")
async def add_skill_to_graph(
    data: AddSkillRequest,
    current_user=Depends(get_current_user),
):
    """Add a skill to the authenticated user's graph."""
    user_id = current_user.get("sub") or current_user.get("id")
    return await service.add_skill(user_id, data.model_dump(exclude_none=True))


@router.put("/me/{node_id}")
async def update_skill_node(
    node_id: str,
    data: UpdateSkillRequest,
    current_user=Depends(get_current_user),
):
    """Update a skill node (proficiency, experience, etc.)."""
    user_id = current_user.get("sub") or current_user.get("id")
    return await service.update_skill(user_id, node_id, data.model_dump(exclude_none=True))


@router.delete("/me/{node_id}")
async def remove_skill_node(
    node_id: str,
    current_user=Depends(get_current_user),
):
    """Remove a skill from the user's graph."""
    user_id = current_user.get("sub") or current_user.get("id")
    return await service.remove_skill(user_id, node_id)


@router.post("/me/bulk")
async def bulk_add_skills(
    data: BulkAddSkillsRequest,
    current_user=Depends(get_current_user),
):
    """Bulk add/update skills to the user's graph."""
    user_id = current_user.get("sub") or current_user.get("id")
    skills_data = [s.model_dump(exclude_none=True) for s in data.skills]
    return await service.bulk_add_skills(user_id, skills_data)


# ═══════════════════════════════════════════════
#  GRAPH INTELLIGENCE ENDPOINTS
# ═══════════════════════════════════════════════

@router.get("/graph/related")
async def get_related_skills(
    skill: str = Query(..., description="Skill name or ID to expand"),
    depth: int = Query(2, ge=1, le=4),
    current_user=Depends(get_current_user),
):
    """Traverse skill relationships from a starting skill."""
    skill_id = await graph.resolve_skill_id(skill)
    if not skill_id:
        raise HTTPException(status_code=404, detail=f"Skill '{skill}' not found in taxonomy")

    related = await graph.bfs_traverse(skill_id, depth=depth)

    # Resolve IDs back to names
    from core.supabase import get_supabase
    db = get_supabase()
    named = {}
    if db and related:
        ids = list(related.keys())
        for sid in ids:
            tax = db.table("skill_taxonomy").select("name").eq("id", sid).execute()
            name = tax.data[0]["name"] if tax.data else sid
            named[name] = related[sid]

    return {"skill": skill, "depth": depth, "related_skills": named, "total_connections": len(named)}


@router.get("/graph/expand-job/{job_id}")
async def expand_job_skills(
    job_id: str,
    depth: int = Query(2, ge=1, le=4),
    current_user=Depends(get_current_user),
):
    """Expand a job's required skills into a full semantic graph."""
    result = await graph.expand_job_skill_graph(job_id=job_id, depth=depth)
    return result


@router.post("/graph/match")
async def match_candidate_to_job(
    payload: SkillMatchRequest,
    current_user=Depends(get_current_user),
):
    """Semantic candidate-job matching using the skill graph."""
    user_id = current_user.get("sub") or current_user.get("id")
    result = await graph.match_candidate_to_job(
        user_id=user_id,
        required_skill_names=payload.required_skills,
    )
    return {"status": "success", "match_result": result}


@router.get("/graph/gaps")
async def get_skill_gaps(
    job_id: str = Query(..., description="Job ID to compare against"),
    current_user=Depends(get_current_user),
):
    """Identify skill gaps between the user and a job's requirements."""
    user_id = current_user.get("sub") or current_user.get("id")
    return await graph.analyze_skill_gaps(user_id, job_id)


# ═══════════════════════════════════════════════
#  AI EXTRACTION ENDPOINTS
# ═══════════════════════════════════════════════

@router.post("/extract/resume")
async def extract_from_resume(
    data: ExtractResumeRequest,
    current_user=Depends(get_current_user),
):
    """Extract skills from resume text using AI."""
    skills = await service.extract_skills_from_resume(data.resume_text)
    return {"status": "success", "extracted_skills": skills, "count": len(skills)}


@router.post("/extract/github")
async def extract_from_github(
    data: ExtractGitHubRequest,
    current_user=Depends(get_current_user),
):
    """Extract skills from a GitHub profile using AI."""
    skills = await service.extract_skills_from_github(data.github_username)
    return {"status": "success", "extracted_skills": skills, "count": len(skills)}


@router.post("/extract/confirm")
async def confirm_extracted_skills(
    data: ExtractConfirmRequest,
    current_user=Depends(get_current_user),
):
    """Confirm and save AI-extracted skills to the user's graph."""
    user_id = current_user.get("sub") or current_user.get("id")
    return await service.confirm_extracted_skills(user_id, data.confirmed_skills)


# ═══════════════════════════════════════════════
#  ENDORSEMENT ENDPOINT
# ═══════════════════════════════════════════════

@router.post("/endorse")
async def endorse_user_skill(
    data: EndorseSkillRequest,
    current_user=Depends(get_current_user),
):
    """Endorse another user's skill."""
    endorser_id = current_user.get("sub") or current_user.get("id")
    return await service.endorse_skill(endorser_id, data.model_dump())

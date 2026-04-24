"""
Project Ledger Router — API endpoints for managing projects.
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from modules.auth.service import get_current_user
from modules.projects.models import ProjectCreate, ProjectUpdate, ProjectResponse, SkillLinkRequest
from modules.projects.service import ProjectService

router = APIRouter()
project_service = ProjectService()

@router.get("/me", response_model=List[ProjectResponse])
async def get_my_projects(current_user = Depends(get_current_user)):
    return await project_service.list_user_projects(current_user["id"])

@router.post("/me", response_model=ProjectResponse)
async def create_my_project(data: ProjectCreate, current_user = Depends(get_current_user)):
    return await project_service.create_project(current_user["id"], data.dict())

@router.put("/me/{project_id}", response_model=ProjectResponse)
async def update_my_project(project_id: UUID, data: ProjectUpdate, current_user = Depends(get_current_user)):
    return await project_service.update_project(current_user["id"], project_id, data.dict(exclude_unset=True))

@router.delete("/me/{project_id}")
async def delete_my_project(project_id: UUID, current_user = Depends(get_current_user)):
    await project_service.delete_project(current_user["id"], project_id)
    return {"status": "deleted"}

@router.post("/me/{project_id}/link-skills")
async def link_skills(project_id: UUID, data: SkillLinkRequest, current_user = Depends(get_current_user)):
    """
    Links multiple skills to a project and boosts their proof scores.
    """
    node_ids = await project_service.link_skills_to_project(
        user_id=current_user["id"],
        project_id=project_id,
        skill_ids=data.skill_ids,
        usage_context=data.usage_context or "",
        weight=data.contribution_weight
    )
    return {"status": "success", "linked_nodes": node_ids}

@router.get("/github/analyze")
async def analyze_repo(url: str, current_user = Depends(get_current_user)):
    """
    Suggests skills and description for a GitHub URL.
    """
    return await project_service.analyze_github_repo(url)

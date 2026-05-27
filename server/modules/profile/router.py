from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db_session
from modules.auth.core.service import get_current_user
from schemas.profile import ProfileResponse, ProfileCreate, ExperienceResponse, ExperienceCreate, EducationResponse, EducationCreate, ProjectResponse, ProjectCreate
from modules.profile.service import ProfileService
from uuid import UUID

router = APIRouter()

@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    service = ProfileService(db)
    return await service.get_or_create_profile(current_user["id"])

@router.get("/{user_id}", response_model=ProfileResponse)
async def get_user_profile(
    user_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    service = ProfileService(db)
    return await service.get_public_profile(user_id, current_user)

@router.patch("/me", response_model=ProfileResponse)
async def update_my_profile(
    data: ProfileCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    service = ProfileService(db)
    return await service.update_profile(current_user["id"], data)

@router.post("/me/experience", response_model=ExperienceResponse)
async def add_experience(
    data: ExperienceCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    service = ProfileService(db)
    return await service.add_experience(current_user["id"], data)

@router.post("/me/education", response_model=EducationResponse)
async def add_education(
    data: EducationCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    service = ProfileService(db)
    return await service.add_education(current_user["id"], data)

@router.post("/me/project", response_model=ProjectResponse)
async def add_project(
    data: ProjectCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    service = ProfileService(db)
    return await service.add_project(current_user["id"], data)

@router.get("/me/strength")
async def get_profile_strength(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Calculate and return the Profile Strength Score dynamically."""
    service = ProfileService(db)
    profile = await service.get_or_create_profile(current_user["id"])
    
    score = 0
    missing = []
    
    if profile.headline: score += 10
    else: missing.append("Add a headline")
    
    if profile.about: score += 10
    else: missing.append("Add an about section")
    
    if profile.resume_url: score += 15
    else: missing.append("Upload a resume")
    
    if profile.experiences: score += 25
    else: missing.append("Add your work experience")
        
    if profile.educations: score += 20
    else: missing.append("Add your education")
        
    if profile.projects: score += 20
    else: missing.append("Add portfolio projects")
        
    return {"status": "success", "data": {"score": min(score, 100), "missing": missing}}

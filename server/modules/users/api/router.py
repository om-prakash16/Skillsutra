from fastapi import APIRouter, Depends, Body, Query, HTTPException
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from core.response import success_response
from core.dependencies import get_db, get_current_user_id
from core.database import get_db_session
from modules.profile.service import ProfileService

router = APIRouter()

async def format_legacy_profile(profile_obj, db: AsyncSession):
    # If it's a dict from cache, use it, else dump it
    import json
    from schemas.profile import ProfileResponse
    
    if isinstance(profile_obj, dict):
        p_dict = profile_obj
    else:
        p_dict = json.loads(ProfileResponse.model_validate(profile_obj).model_dump_json())

    # Map to the old expected structure
    from models.user import User
    from sqlalchemy.future import select
    user_res = await db.execute(select(User).where(User.id == p_dict["user_id"]))
    user = user_res.scalars().first()

    return {
        "profile": {
            "user_id": str(p_dict["user_id"]),
            "username": user.username if user else None,
            "email": user.email if user else None,
            "avatar_url": user.avatar_url if user else None,
            "headline": p_dict.get("headline"),
            "about": p_dict.get("about"),
            "location": p_dict.get("location"),
            "phone": p_dict.get("phone"),
            "full_name": p_dict.get("full_name"),
            "banner_url": p_dict.get("banner_url"),
            "visibility": p_dict.get("visibility_mode"),
            "github_handle": p_dict.get("github_url").split("/")[-1] if p_dict.get("github_url") else None,
        },
        "skills": [],  # We can implement skill mapping here if needed
        "experiences": p_dict.get("experiences", []),
        "projects": p_dict.get("projects", []),
        "education": p_dict.get("educations", []),
        "ai_scores": {}
    }

@router.get("/")
async def get_my_profile(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Fetch the complete profile for the authenticated user using modern ProfileService."""
    service = ProfileService(db)
    from uuid import UUID
    profile_obj = await service.get_or_create_profile(UUID(user_id))
    legacy_format = await format_legacy_profile(profile_obj, db)
    return success_response(data=legacy_format)

@router.post("/create")
async def create_new_user(
    email: str = Body(..., embed=True),
    wallet_address: str = Body(..., embed=True)
):
    """Create a new user identity."""
    db = await get_db()
    res = db.table("users").insert({
        "email": email,
        "wallet_address": wallet_address
    }).execute()
    return success_response(data=res.data[0])

@router.post("/update")
async def update_profile_full(
    data: Dict[str, Any],
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Update profile data across all normalized tables."""
    service = ProfileService(db)
    from schemas.profile import ProfileCreate
    from uuid import UUID
    from models.user import User
    from sqlalchemy.future import select
    from sqlalchemy import update
    
    # Parse section payloads
    profile_data = data.get("profile", {})
    github_data = data.get("github", {})
    settings_data = data.get("settings", {})
    
    visibility = settings_data.get("visibility") or profile_data.get("visibility") or "PUBLIC"
    
    create_schema = ProfileCreate(
        full_name=profile_data.get("full_name") or (f"{profile_data.get('firstName', '')} {profile_data.get('lastName', '')}".strip() if profile_data.get("firstName") else None),
        headline=profile_data.get("headline"),
        about=profile_data.get("about") or profile_data.get("bio"),
        location=profile_data.get("location"),
        phone=profile_data.get("phone"),
        banner_url=profile_data.get("banner_url"),
        resume_url=profile_data.get("resume_url"),
        visibility_mode=visibility.upper() if isinstance(visibility, str) else "PUBLIC"
    )
    
    if github_data and github_data.get("username"):
        create_schema.github_url = f"https://github.com/{github_data.get('username')}"
    
    if profile_data.get("avatar_url"):
        await db.execute(
            update(User).where(User.id == UUID(user_id)).values(avatar_url=profile_data["avatar_url"])
        )
        await db.commit()
    
    profile_obj = await service.update_profile(UUID(user_id), create_schema)
    
    # Handle relationships
    if "experiences" in data:
        from models.profile import Experience
        from schemas.profile import ExperienceCreate
        await db.execute(Experience.__table__.delete().where(Experience.profile_id == profile_obj.id))
        for exp in data["experiences"]:
            sd = exp.get("start_date") or exp.get("startDate")
            ed = exp.get("end_date") or exp.get("endDate")
            if ed == "Present": ed = None
            if sd and len(sd) == 7: sd += "-01"
            if sd and len(sd) == 4: sd += "-01-01"
            if ed and len(ed) == 7: ed += "-01"
            if ed and len(ed) == 4: ed += "-01-01"
            
            try:
                await service.add_experience(UUID(user_id), ExperienceCreate(
                    company_name=exp.get("company_name") or exp.get("company") or "Unknown",
                    title=exp.get("role") or "Unknown",
                    location=exp.get("location"),
                    start_date=sd or "2024-01-01",
                    end_date=ed,
                    description=exp.get("description")
                ))
            except Exception as e:
                print("Error adding experience:", e)
                
    if "education" in data:
        from models.profile import Education
        from schemas.profile import EducationCreate
        await db.execute(Education.__table__.delete().where(Education.profile_id == profile_obj.id))
        for edu in data["education"]:
            sd = edu.get("start_date") or edu.get("startYear")
            ed = edu.get("end_date") or edu.get("endYear")
            if sd and len(sd) == 4: sd += "-01-01"
            if ed and len(ed) == 4: ed += "-01-01"
            
            try:
                await service.add_education(UUID(user_id), EducationCreate(
                    school=edu.get("institution") or "Unknown",
                    degree=edu.get("degree") or "Unknown",
                    field_of_study=edu.get("field_of_study") or edu.get("fieldOfStudy"),
                    start_date=sd or "2024-01-01",
                    end_date=ed
                ))
            except Exception as e:
                print("Error adding education:", e)
                
    if "projects" in data:
        from models.profile import Project
        from schemas.profile import ProjectCreate
        await db.execute(Project.__table__.delete().where(Project.profile_id == profile_obj.id))
        for proj in data["projects"]:
            try:
                await service.add_project(UUID(user_id), ProjectCreate(
                    title=proj.get("title") or "Unknown Project",
                    description=proj.get("description"),
                    url=proj.get("project_url") or proj.get("link"),
                    github_url=proj.get("github_url") or proj.get("github"),
                    skills_used=proj.get("stack", [])
                ))
            except Exception as e:
                print("Error adding project:", e)
                
    return success_response(message="Profile synchronized successfully")

@router.get("/portfolio/{user_code}")
async def get_public_portfolio(user_code: str, db: AsyncSession = Depends(get_db_session)):
    """Publicly accessible portfolio endpoint by user_code."""
    from models.user import User
    from sqlalchemy.future import select
    user_res = await db.execute(select(User).where(User.user_code == user_code))
    user = user_res.scalars().first()
    if not user or user.visibility == "private":
        return success_response(data=None, message="Portfolio not found or private", status_code=404)
        
    service = ProfileService(db)
    profile_obj = await service.get_public_profile(user.id, current_user=None)
    if not profile_obj:
        return success_response(data=None, message="Portfolio not found", status_code=404)
        
    legacy_format = await format_legacy_profile(profile_obj, db)
    return success_response(data=legacy_format)

@router.get("/public/{user_id}")
async def get_public_profile_by_id(user_id: str, db: AsyncSession = Depends(get_db_session)):
    """Publicly accessible profile endpoint by user UUID."""
    service = ProfileService(db)
    from uuid import UUID
    try:
        profile_obj = await service.get_public_profile(UUID(user_id), current_user=None)
    except Exception as e:
        return success_response(data=None, message="Profile not found or private", status_code=404)
        
    if not profile_obj:
        return success_response(data=None, message="Profile not found", status_code=404)
        
    legacy_format = await format_legacy_profile(profile_obj, db)
    return success_response(data=legacy_format)

@router.get("/search/{user_code}")
async def search_candidate_by_code(user_code: str):
    """Search candidate by unique Best Hiring code."""
    db = await get_db()
    response = db.table("users").select("id, user_code, full_name, visibility").eq("user_code", user_code).execute()
    if not response.data:
        return success_response(data=None, message="Candidate not found", status_code=404)
    
    user = response.data[0]
    if user["visibility"] == "private":
         return success_response(data=None, message="Candidate profile is private", status_code=403)
         
    return success_response(data=user)

@router.get("/cv")
async def generate_dynamic_cv(
    user_id: str = Depends(get_current_user_id)
):
    """Generate dynamic CV data from database state."""
    from modules.users.core.cv_service import CVService
    cv_data = await CVService.generate_cv_data(user_id)
    return success_response(data={
        "cv_layout": cv_data,
        "download_url": "/api/v1/profile/cv/download"
    })

@router.post("/saved-items")
async def save_item(
    payload: dict,
    user_id: str = Depends(get_current_user_id)
):
    """Save a job, course, or post for later."""
    db = await get_db()
    item = {
        "user_id": user_id,
        "item_type": payload.get("item_type", "job"),
        "item_id": payload.get("item_id")
    }
    
    # Check if already saved
    existing = await db.table("saved_items").select("*").eq("user_id", user_id).eq("item_type", item["item_type"]).eq("item_id", item["item_id"]).execute()
    if existing.data:
        # Toggle: remove if it exists (Unsave)
        await db.table("saved_items").delete().eq("id", existing.data[0]["id"]).execute()
        return success_response(message="Item unsaved successfully")
        
    res = await db.table("saved_items").insert(item).execute()
    return success_response(data=res.data[0] if res.data else item, message="Item saved successfully")

@router.get("/saved-items")
async def get_saved_items(
    item_type: str = Query(None),
    user_id: str = Depends(get_current_user_id)
):
    """Retrieve saved items."""
    db = await get_db()
    
    if item_type == "job":
        query = db.table("saved_items").select("*, jobs(title, location, job_type, companies(company_name))").eq("user_id", user_id).eq("item_type", "job")
    else:
        query = db.table("saved_items").select("*").eq("user_id", user_id)
        if item_type:
            query = query.eq("item_type", item_type)
        
    res = await query.order("created_at", desc=True).execute()
    return success_response(data=res.data)

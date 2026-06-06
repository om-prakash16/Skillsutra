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
            "visibility": p_dict.get("visibility_mode"),
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
    
    # Simple mapping of legacy data to modern ProfileCreate schema
    profile_data = data.get("profile", {})
    create_schema = ProfileCreate(
        headline=profile_data.get("headline"),
        about=profile_data.get("about") or profile_data.get("bio"),
        banner_url=profile_data.get("banner_url"),
        visibility_mode=profile_data.get("visibility", "PUBLIC")
    )
    
    await service.update_profile(UUID(user_id), create_schema)
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

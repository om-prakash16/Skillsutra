import json
from fastapi import APIRouter, Depends, Query, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from core.response import success_response
from core.database import get_db_session
from core.redis import get_redis_client
from modules.auth.core.service import get_current_user

from models.identity import UserIdentity, UsernameHistory, VisibilitySettings, PublicProfile, PortfolioProject, ProfileView
from schemas.identity import UsernameClaim, VisibilitySettingsUpdate, PortfolioProjectCreate, validate_username_slug

router = APIRouter(prefix="/identity", tags=["Public Developer Identity"])
RESERVED_USERNAMES = {"admin", "support", "jobs", "company", "talent", "portfolio", "api", "auth", "billing"}

@router.get("/check-username")
async def check_username_availability(
    q: str = Query(..., min_length=3, max_length=30),
    db: AsyncSession = Depends(get_db_session)
):
    """Check if a slug is available for claiming."""
    try:
        slug = validate_username_slug(q)
    except ValueError as e:
        return success_response(data={"available": False, "reason": str(e)})
        
    if slug in RESERVED_USERNAMES:
        return success_response(data={"available": False, "reason": "Reserved username"})
        
    stmt = select(UserIdentity).where(UserIdentity.username == slug)
    result = await db.execute(stmt)
    if result.scalars().first():
        return success_response(data={"available": False, "reason": "Already taken"})
        
    return success_response(data={"available": True, "slug": slug})

@router.put("/username")
async def claim_username(
    payload: UsernameClaim,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Claims or updates a user's globally unique username slug."""
    slug = validate_username_slug(payload.username)
    if slug in RESERVED_USERNAMES:
        raise HTTPException(status_code=400, detail="Reserved username")
        
    user_id = UUID(current_user["id"])
    
    # Check if taken
    stmt = select(UserIdentity).where(UserIdentity.username == slug)
    result = await db.execute(stmt)
    existing = result.scalars().first()
    if existing and existing.user_id != user_id:
        raise HTTPException(status_code=400, detail="Username already taken")
        
    # Fetch current identity
    stmt = select(UserIdentity).where(UserIdentity.user_id == user_id)
    result = await db.execute(stmt)
    identity = result.scalars().first()
    
    if identity:
        if identity.username == slug:
            return success_response(data={"username": slug}, message="Username unchanged")
            
        # Log history
        history = UsernameHistory(user_id=user_id, old_username=identity.username)
        db.add(history)
        identity.username = slug
    else:
        # Create new
        identity = UserIdentity(user_id=user_id, username=slug)
        db.add(identity)
        
    await db.commit()
    
    # Clear cache
    redis = get_redis_client()
    await redis.delete(f"identity:profile:{slug}")
    
    return success_response(data={"username": slug}, message="Username claimed successfully")

@router.patch("/privacy")
async def update_privacy_settings(
    payload: VisibilitySettingsUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Update granular visibility controls for the identity profile."""
    user_id = UUID(current_user["id"])
    
    stmt = select(VisibilitySettings).where(VisibilitySettings.user_id == user_id)
    result = await db.execute(stmt)
    settings = result.scalars().first()
    
    if not settings:
        settings = VisibilitySettings(user_id=user_id)
        db.add(settings)
        
    if payload.profile_visibility: settings.profile_visibility = payload.profile_visibility
    if payload.resume_visibility: settings.resume_visibility = payload.resume_visibility
    if payload.portfolio_visibility: settings.portfolio_visibility = payload.portfolio_visibility
    if payload.social_visibility: settings.social_visibility = payload.social_visibility
    
    await db.commit()
    
    return success_response(data=None, message="Privacy settings updated")

@router.get("/public/{username}")
async def get_public_identity(
    username: str,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Highly Cached Route. 
    Fetches the public profile, portfolio, and enforces privacy rules.
    If the viewer is a recruiter (checked via token), it injects AI hiring recommendations.
    """
    redis = get_redis_client()
    cache_key = f"identity:profile:{username}"
    
    # Is the requester a recruiter? 
    # (Since this is a public route, we don't strictly require authentication, but we check if a token was passed)
    is_recruiter = False
    auth_header = request.headers.get("Authorization")
    # In a full implementation, we'd decode the JWT here safely.
    if auth_header and "Bearer" in auth_header:
        # Mocking recruiter check for demonstration
        is_recruiter = True # Assume true if they have a token for now

    # 1. Check Redis Cache First
    cached_data = await redis.get(cache_key)
    if cached_data:
        data = json.loads(cached_data)
        
        # Privacy Enforcement from Cache
        if data["visibility"]["profile"] == 'PRIVATE' and not is_recruiter:
            raise HTTPException(status_code=404, detail="Profile not found or private")
            
        if not is_recruiter:
            data.pop("recruiter_ai_recommendation", None)
            
        return success_response(data=data)
        
    # 2. Cache Miss: Query Database
    stmt = select(UserIdentity).where(UserIdentity.username == username)
    result = await db.execute(stmt)
    identity = result.scalars().first()
    
    if not identity:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_id = identity.user_id
    
    # Fetch Settings and Profile
    settings_stmt = select(VisibilitySettings).where(VisibilitySettings.user_id == user_id)
    settings = (await db.execute(settings_stmt)).scalars().first()
    
    profile_stmt = select(PublicProfile).where(PublicProfile.user_id == user_id)
    profile = (await db.execute(profile_stmt)).scalars().first()
    
    # Aggregate data
    visibility_map = {
        "profile": settings.profile_visibility if settings else 'PUBLIC',
        "resume": settings.resume_visibility if settings else 'RECRUITER_ONLY',
        "portfolio": settings.portfolio_visibility if settings else 'PUBLIC'
    }
    
    response_data = {
        "username": identity.username,
        "is_verified": identity.is_verified,
        "headline": profile.headline if profile else None,
        "bio": profile.bio if profile else None,
        "skills": profile.skills if profile else [],
        "visibility": visibility_map,
        "recruiter_ai_recommendation": "Strong candidate. Excellent architectural skills. Recommend shortlisting." # Mocked AI data
    }
    
    # 3. Write to Redis (Cache for 15 minutes)
    await redis.setex(cache_key, 900, json.dumps(response_data))
    
    # Enforce Privacy before returning
    if visibility_map["profile"] == 'PRIVATE' and not is_recruiter:
        raise HTTPException(status_code=404, detail="Profile not found or private")
        
    if not is_recruiter:
        response_data.pop("recruiter_ai_recommendation", None)
        
    # Log the view asynchronously in production (omitted here for brevity)
    return success_response(data=response_data)

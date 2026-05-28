from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db_session
from models.user import User
from models.profile import Profile
from models.identity import VisibilitySettings
from modules.auth.core.service import get_current_user, auth_service
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.username_utils import generate_unique_username, is_reserved_username, is_valid_username
import re

router = APIRouter()
security_optional = HTTPBearer(auto_error=False)

async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security_optional)):
    if not credentials:
        return None
    try:
        user = await auth_service.get_current_user(credentials)
        return user
    except Exception:
        return None

@router.get("/public/{username}")
async def get_public_profile(username: str, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user_optional)):
    """Fetch public profile by username."""
    # Find user by username (case insensitive check)
    result = await db.execute(select(User).where(User.username.ilike(username)))
    target_user = result.scalars().first()
    
    if not target_user:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    # Get profile data
    profile_result = await db.execute(select(Profile).where(Profile.user_id == target_user.id))
    profile = profile_result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not configured")
        
    # Check visibility settings
    visibility_result = await db.execute(select(VisibilitySettings).where(VisibilitySettings.user_id == target_user.id))
    visibility = visibility_result.scalars().first()
    
    vis_mode = visibility.profile_visibility if visibility else "PUBLIC"
    
    # If not public, only allow access if logged in user is the owner (or recruiter later)
    if vis_mode == "PRIVATE":
        if not current_user or str(current_user.get("id")) != str(target_user.id):
            raise HTTPException(status_code=404, detail="Profile not found")
            
    if vis_mode == "RECRUITER_ONLY":
        # Simplified: require authenticated user, in real world check if recruiter role
        if not current_user:
             raise HTTPException(status_code=403, detail="Only recruiters can view this profile")
             
    # Return sanitized public data
    return {
        "status": "success",
        "data": {
            "id": str(target_user.id),
            "username": target_user.username,
            "headline": profile.headline,
            "about": profile.about,
            "banner_url": profile.banner_url,
            "avatar_url": None, # Should join with User profile pic if added
            "social_links": {
                "github": profile.github_url,
                "linkedin": profile.linkedin_url,
                "portfolio": profile.portfolio_url
            } if (not visibility or visibility.social_visibility != 'PRIVATE' or (current_user and str(current_user.get("id")) == str(target_user.id))) else {},
            # These would be populated properly with joins in a full query
            "skills": [],
            "experiences": [], 
            "projects": []
        }
    }

@router.get("/check-username/{username}")
async def check_username_availability(username: str, db: AsyncSession = Depends(get_db_session)):
    """Check if a username is available."""
    if not is_valid_username(username):
        return {"available": False, "reason": "invalid_format"}
        
    if is_reserved_username(username):
        return {"available": False, "reason": "reserved"}
        
    result = await db.execute(select(User).where(User.username.ilike(username)))
    if result.scalars().first():
        return {"available": False, "reason": "taken"}
        
    return {"available": True, "reason": "available"}

@router.post("/claim-username")
async def claim_username(payload: dict, db: AsyncSession = Depends(get_db_session), current_user: dict = Depends(get_current_user)):
    """Allow user to claim or change their username."""
    new_username = payload.get("username")
    
    if not new_username:
        raise HTTPException(status_code=400, detail="Username is required")
        
    if not is_valid_username(new_username):
        raise HTTPException(status_code=400, detail="Invalid username format")
        
    if is_reserved_username(new_username):
        raise HTTPException(status_code=400, detail="Username is reserved")
        
    # Check if already taken
    result = await db.execute(select(User).where(User.username.ilike(new_username)))
    existing_user = result.scalars().first()
    
    if existing_user and str(existing_user.id) != str(current_user.get("id")):
        raise HTTPException(status_code=400, detail="Username is already taken")
        
    # Get the actual user object from db to update
    user_result = await db.execute(select(User).where(User.id == current_user.get("id")))
    db_user = user_result.scalars().first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Update username
    db_user.username = new_username.lower()
    await db.commit()
    
    return {"status": "success", "username": db_user.username}

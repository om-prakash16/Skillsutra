import httpx
import logging
import random
from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
from modules.auth.core.service import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db_session
from sqlalchemy import select

router = APIRouter()
logger = logging.getLogger(__name__)

from modules.ai.services.competitive_programming_service import competitive_programming_service


@router.get("/sync/{platform}")
async def sync_platform(
    platform: str,
    username: str = Query(..., description="The handle/username for the platform"),
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Sync public developer profile signals.
    Supported platforms: leetcode, codeforces, codechef, hackerrank, hackerearth, stackoverflow
    """
    user_id = user.get("sub")
    platform = platform.lower()
    
    try:
        data = None
        if platform == "leetcode":
            data = await competitive_programming_service.fetch_leetcode(username)
        elif platform == "codeforces":
            data = await competitive_programming_service.fetch_codeforces(username)
        elif platform == "codechef":
            data = await competitive_programming_service.fetch_codechef(username)
        elif platform == "hackerrank":
            data = await competitive_programming_service.fetch_hackerrank(username)
        elif platform == "hackerearth":
            data = await competitive_programming_service.fetch_hackerearth(username)
        elif platform == "stackoverflow":
            data = await competitive_programming_service.fetch_stackoverflow(username)
        elif platform in ["behance", "dribbble", "adobe_portfolio", "artstation", "sketchfab", "youtube", "vimeo", "medium", "substack", "personal_website"]:
            # Simple linking logic: just store the provided ID/URL
            data = {
                "platform": platform.replace("_", " ").title(),
                "username_or_url": username,
                "status": "Linked Verified"
            }
        else:
            raise HTTPException(status_code=400, detail="Unsupported platform")

        # Upsert the synced data into our database (e.g. dynamic_profile_data or a dedicated integrations table)
        if db:
            from models.user import User
            result = await db.execute(select(User).where(User.id == user_id))
            db_user = result.scalars().first()
            if db_user:
                profile = dict(db_user.dynamic_profile_data or {})
                if "integrations" not in profile:
                    profile["integrations"] = {}
                profile["integrations"][platform] = data
                
                db_user.dynamic_profile_data = profile
                await db.commit()

        return {"status": "success", "data": data}
        
    except Exception as e:
        logger.error(f"Platform sync failed for {platform} ({username}): {e}")
        raise HTTPException(status_code=500, detail=f"Failed to sync {platform} profile: {str(e)}")

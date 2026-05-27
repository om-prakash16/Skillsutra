from fastapi import APIRouter, Depends, Query
from core.response import success_response
from modules.auth.core.service import get_current_user

router = APIRouter(prefix="/gamification", tags=["Gamification Ecosystem"])

@router.get("/leaderboard")
async def get_global_leaderboard(
    limit: int = Query(10, ge=1, le=100)
):
    """
    Fetch the top users from the Redis Sorted Set (ZREVRANGE).
    """
    # Mocking Redis response
    leaderboard = [
        {"rank": 1, "user_id": "uuid-1", "xp": 15000, "level": 12},
        {"rank": 2, "user_id": "uuid-2", "xp": 14200, "level": 11}
    ]
    return success_response(data=leaderboard)

@router.get("/me/reputation")
async def get_my_reputation(
    current_user = Depends(get_current_user)
):
    """Fetch current user's XP, Level, and Badges."""
    user_id = current_user.get("sub") or current_user.get("id")
    
    # Placeholder for DB fetch
    stats = {
        "xp_points": 4500,
        "current_level": 5,
        "current_streak": 3,
        "badges": ["Python Pro", "FastAPI Contributor"]
    }
    return success_response(data=stats)

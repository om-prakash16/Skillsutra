from fastapi import APIRouter, Depends, Body
from core.response import success_response
from modules.auth.core.service import get_current_user
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/habits", tags=["Goal & Habit Tracking"])

@router.get("/")
async def get_my_habits(
    current_user = Depends(get_current_user)
):
    """Retrieve user's active habits and streaks."""
    # Production: Fetch from DB and check if streaks are broken
    habits = [
        {"id": "uuid-habit-1", "type": "CODE_CHALLENGE", "target": 1, "current_streak": 5},
        {"id": "uuid-habit-2", "type": "APPLY_JOB", "target": 3, "current_streak": 0}
    ]
    return success_response(data=habits)

@router.post("/")
async def create_habit(
    payload: dict = Body(...),
    current_user = Depends(get_current_user)
):
    """Set a new daily habit/goal."""
    habit = {
        "user_id": current_user.get("sub"),
        "habit_type": payload.get("habit_type"),
        "target_count": payload.get("target_count"),
        "current_streak": 0
    }
    return success_response(data=habit, message="Habit created successfully")

@router.post("/{habit_id}/log")
async def log_habit_progress(
    habit_id: str,
    current_user = Depends(get_current_user)
):
    """
    Log completion of a habit for today.
    Increments streak if the target is hit.
    """
    logger.info(f"User {current_user.get('sub')} logged habit {habit_id}")
    
    # Production Logic:
    # 1. Fetch Habit
    # 2. Check if already logged today
    # 3. If not, increment current_streak
    # 4. If streak hits a milestone (e.g. 7 days), trigger Gamification event.
    
    updated_habit = {
        "id": habit_id,
        "current_streak": 6,
        "last_completed_at": datetime.utcnow().isoformat()
    }
    
    return success_response(data=updated_habit, message="Habit logged. Streak updated!")

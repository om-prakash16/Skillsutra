from fastapi import APIRouter, Depends, Query, Body
from core.response import success_response
from modules.auth.core.service import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contests", tags=["Contests & Challenges"])

@router.get("/")
async def list_active_contests():
    """Retrieve a list of currently active or upcoming hackathons/contests."""
    contests = [
        {"id": "uuid-contest-1", "title": "Spring AI Hackathon 2026", "status": "ACTIVE"},
        {"id": "uuid-contest-2", "title": "System Design Challenge", "status": "UPCOMING"}
    ]
    return success_response(data=contests)

@router.post("/{contest_id}/submit")
async def submit_challenge_solution(
    contest_id: str,
    payload: dict = Body(...),
    current_user = Depends(get_current_user)
):
    """
    Submit code for a contest challenge.
    Enqueues the code payload to Celery for isolated Docker sandboxed execution.
    """
    user_id = current_user.get("sub") or current_user.get("id")
    code = payload.get("code")
    
    # In production:
    # 1. Save submission to DB with status PENDING
    # 2. Trigger Celery task `execute_contest_code.delay(submission_id)`
    
    return success_response(
        data={"contest_id": contest_id, "status": "EVALUATING"}, 
        message="Solution submitted and sent for secure execution."
    )

@router.get("/{contest_id}/leaderboard")
async def get_contest_leaderboard(
    contest_id: str,
    limit: int = Query(50)
):
    """
    Fetch the realtime contest leaderboard from Redis Sorted Sets.
    """
    # Mocking Redis response
    # In production: redis_client.zrevrange(f"contest:{contest_id}:leaderboard", 0, limit, withscores=True)
    leaderboard = [
        {"rank": 1, "user_id": "uuid-top-coder", "score": 950},
        {"rank": 2, "user_id": "uuid-runner-up", "score": 910}
    ]
    return success_response(data=leaderboard)

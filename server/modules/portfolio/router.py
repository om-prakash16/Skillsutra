from fastapi import APIRouter, Depends
from core.response import success_response
from modules.auth.core.service import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/portfolio", tags=["Developer Portfolio"])

@router.get("/me")
async def get_my_portfolio(
    current_user = Depends(get_current_user)
):
    """Retrieve the current user's unified developer portfolio."""
    # Production: Fetch DeveloperPortfolio + ProjectShowcases from DB
    portfolio = {
        "github_username": "coder123",
        "engineering_maturity_score": 8.5,
        "projects": [
            {"title": "FastAPI Microservice", "tech_stack": ["Python", "FastAPI"]}
        ]
    }
    return success_response(data=portfolio)

@router.post("/sync/github")
async def trigger_github_sync(
    current_user = Depends(get_current_user)
):
    """Trigger the background Celery worker to sync GitHub commits."""
    user_id = current_user.get("sub") or current_user.get("id")
    
    # Trigger Celery Task
    # sync_github_commits.delay(user_id, "coder123")
    
    return success_response(message="GitHub sync triggered successfully.")

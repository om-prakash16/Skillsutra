from fastapi import APIRouter, Depends
from portal.apps.matching.controller import MatchingController
from portal.core.security import get_current_user

router = APIRouter()
controller = MatchingController()

@router.get("/jobs")
async def get_matched_jobs(user=Depends(get_current_user)):
    """Find best matching jobs for the current user."""
    return await controller.find_jobs_for_user(user["sub"])

@router.get("/candidates/{job_id}")
async def get_matched_candidates(job_id: str):
    """Find best matching candidates for a specific job."""
    return await controller.find_candidates_for_job(job_id)

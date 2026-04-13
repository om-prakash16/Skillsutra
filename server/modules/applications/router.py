from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from modules.auth.service import require_permission, get_current_user
from modules.jobs.service import JobService
from modules.notifications.service import NotificationService

router = APIRouter()
job_service = JobService()

@router.get("/user")
async def get_user_applications(current_user = Depends(get_current_user)):
    """
    Fetch all applications for the current candidate.
    """
    return await job_service.get_user_applications(current_user["id"])

@router.get("/company")
async def get_company_applications(company_id: str, current_user = Depends(get_current_user)):
    """
    Fetch all applications for a specific company (Recruiter view).
    """
    return await job_service.get_company_applications(company_id)

@router.patch("/status")
async def update_application_status(
    application_id: str, 
    status: str, 
    recruiter = Depends(require_permission("job.moderate"))
):
    """
    Update application status (Shortlist, Hire, Reject).
    Triggers notifications and activity logs via JobService.
    """
    # The JobService now handles notifications and activity logging internally
    result = await job_service.update_application_status(
        app_id=application_id, 
        status=status, 
        recruiter_id=recruiter.get("sub") or recruiter.get("id")
    )
    
    return result

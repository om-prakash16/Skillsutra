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
    Triggers notifications and activity logs.
    """
    result = await job_service.update_application_status(
        application_id=application_id, 
        new_status=status, 
        recruiter_id=recruiter["id"]
    )
    
    # Notify Candidate
    await NotificationService.create_event_notification(
        user_id=result["candidate_id"],
        type="application_status",
        title="Application Status Updated",
        message=f"Your application status for {result['job_title']} has been updated to: {status}"
    )
    
    return result

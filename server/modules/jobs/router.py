from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from modules.auth.service import require_permission, get_current_user
from modules.jobs.service import JobService
from modules.search.service import SearchService
from modules.jobs.models import (
    JobCreate, JobUpdate, JobResponse,
    JobApplicationRequest, JobApplicationResponse,
    CompanyCreate, CompanyResponse,
    JobSchemaFieldResponse,
    ApplicationCreate, ApplicationResponse
)
from core.postgres import get_db_connection
from modules.notifications.service import NotificationService

router = APIRouter()
job_service = JobService()

# --- Company Endpoints ---

@router.get("/jobs/list")
async def list_jobs(user_id: Optional[str] = None):
    """
    SECTION 10: Public job board with dynamic AI scores for candidates.
    """
    return await job_service.get_jobs_with_scores(user_id)

@router.get("/jobs/details/{job_id}")
async def get_job_details(job_id: str):
    """
    SECTION 10: Job detail view.
    """
    return await job_service.get_job_details(job_id)

# --- Job Posting Endpoints ---

@router.post("/jobs/create", response_model=JobResponse)
async def create_job(job: JobCreate, user = Depends(get_current_user)):
    """
    SECTION 10: Create a job post. 
    """
    result = await job_service.create_job(job.model_dump())
    return JobResponse(id=result["id"], **result)

@router.post("/jobs/apply", response_model=ApplicationResponse)
async def apply_to_job(data: ApplicationCreate, user = Depends(get_current_user)):
    """
    SECTION 10: Application submission + AI match scoring.
    """
    result = await job_service.apply_to_job(data.job_id, data.candidate_id)
    return ApplicationResponse(id=result["id"], **result)

@router.get("/applications/user")
async def get_user_applications(user_id: str):
    """
    SECTION 10: Candidate's application tracking.
    """
    db = get_supabase()
    response = db.table("applications") \
        .select("*, jobs(title, companies(company_name))") \
        .eq("candidate_id", user_id) \
        .execute()
    return response.data

@router.get("/applications/company/{company_id}")
async def get_company_applications(company_id: str):
    """
    SECTION 10: Recruiter's applicant list.
    """
    return await job_service.get_company_applications(company_id)

# --- Job Application Endpoints ---

@router.post("/jobs/apply", response_model=ApplicationResponse)
async def apply_to_job(data: ApplicationCreate, user = Depends(get_current_user)):
    """
    Submits an application and triggers high-fidelity AI matching.
    """
    result = await job_service.apply_to_job(data.job_id, data.candidate_wallet)
    
    # Notify Candidate
    await NotificationService.create_event_notification(
        user_id=user.get("id"),
        type="job_apply",
        title="Application Submitted",
        message=f"You successfully applied for the job. AI Match Score: {result['ai_match_score']}%"
    )
    
    # Log Activity
    await NotificationService.log_activity(
        user_id=user.get("id"),
        action_type="apply_to_job",
        entity_type="job",
        entity_id=data.job_id,
        description=f"Applied with score {result['ai_match_score']}%"
    )
    
    return ApplicationResponse(id=result["id"], status=result["status"], ai_match_score=result["ai_match_score"], **data.model_dump())

@router.get("/applications/user")
async def get_user_applications(wallet: str):
    """
    Fetch all applications for a specific candidate.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM applications WHERE candidate_wallet = %s", (wallet,))
        rows = cur.fetchall()
        return [{"id": str(r[0]), "status": r[4], "ai_score": r[5]} for r in rows]
    finally:
        cur.close()
        conn.close()

@router.patch("/applications/{app_id}/status")
async def update_app_status(app_id: str, status: str, recruiter = Depends(require_permission("job.moderate"))):
    """
    Step 13: Recruiter Action (Shortlist, Hire, Reject).
    """
    return await job_service.update_application_status(
        application_id=app_id, 
        new_status=status, 
        recruiter_id=recruiter.get("id")
    )

from fastapi import APIRouter, Depends, Query, status
from typing import List, Optional

from core.response import success_response
from core.dependencies import get_current_user_id, get_company_id

# Updated Imports to match new structure
from modules.jobs.repos.job_repository import job_repository
from modules.jobs.schemas.job_schemas import JobCreate, JobResponse
from modules.jobs.services.discovery_service import discovery_service

router = APIRouter()

@router.get("/list", response_model=List[JobResponse])
async def list_jobs(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user_id: Optional[str] = Query(None)
):
    """List all available jobs with optional AI scoring."""
    if user_id:
        data = await discovery_service.get_jobs_with_user_scores(user_id)
    else:
        data = await job_repository.list_jobs(limit=limit, offset=offset)
    
    return success_response(data=data)

@router.get("/recommendations", response_model=List[JobResponse])
async def get_job_recommendations(
    limit: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id)
):
    """Get smart job recommendations based on semantic matching using pgvector."""
    # This will interact with discovery_service to perform vector similarity search
    # between User Profile embedding and Job embeddings
    data = await discovery_service.get_vector_recommendations(user_id=user_id, limit=limit)
    return success_response(data=data, message="Job recommendations generated successfully")

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    """Retrieve detailed information for a specific job."""
    job = await job_repository.get_by_id(job_id)
    return success_response(data=job)

@router.post("/create", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    payload: JobCreate,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id)
):
    """Post a new job opportunity."""
    job_data = payload.model_dump()
    job_data.update({
        "company_id": company_id,
        "created_by": user_id
    })
    
    result = await job_repository.create(job_data)
    return success_response(data=result, message="Job posting created successfully")

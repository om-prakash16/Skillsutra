from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import uuid

from database.core import get_db
from models.ats import ATSJob, ATSCandidate, ATSApplication, ATSPipelineStage, ATSCandidateProfile
from api.v1.auth_router import get_current_user

router = APIRouter()

@router.get("/jobs", tags=["ATS Jobs"])
async def get_jobs(db: Session = Depends(get_db)):
    """Fetch all jobs (for admin or career site)."""
    jobs = db.query(ATSJob).all()
    return {
        "success": True, 
        "data": [{"id": j.id, "title": j.title, "status": j.status, "employment_type": j.employment_type} for j in jobs]
    }

@router.post("/jobs", tags=["ATS Jobs"])
async def create_job(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Create a new job requisition."""
    job = ATSJob(
        title=payload["title"],
        description=payload.get("description", ""),
        status=payload.get("status", "draft")
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"success": True, "data": {"id": job.id, "title": job.title}}

@router.get("/applications/board/{job_id}", tags=["ATS Pipelines"])
async def get_job_board(job_id: str, db: Session = Depends(get_db)):
    """Fetch all applications for a specific job, grouped by pipeline stage (Kanban)."""
    job = db.query(ATSJob).filter(ATSJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    stages = db.query(ATSPipelineStage).filter(ATSPipelineStage.pipeline_id == job.pipeline_id).order_by(ATSPipelineStage.order_index).all()
    
    board = []
    for stage in stages:
        apps = db.query(ATSApplication).filter(ATSApplication.job_id == job_id, ATSApplication.stage_id == stage.id).all()
        board.append({
            "stage_id": stage.id,
            "stage_name": stage.name,
            "applications": [{"id": a.id, "candidate_id": a.candidate_id, "score": a.ai_match_score} for a in apps]
        })
        
    return {"success": True, "data": board}

@router.post("/applications/{application_id}/move", tags=["ATS Pipelines"])
async def move_application(application_id: str, payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """Move an application to a new stage."""
    new_stage_id = payload.get("stage_id")
    app = db.query(ATSApplication).filter(ATSApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    app.stage_id = new_stage_id
    db.commit()
    return {"success": True}

def _parse_resume_background_task(candidate_id: str, db: Session):
    """Background task to simulate AI parsing a resume."""
    profile = db.query(ATSCandidateProfile).filter(ATSCandidateProfile.candidate_id == candidate_id).first()
    if not profile:
        profile = ATSCandidateProfile(candidate_id=candidate_id)
        db.add(profile)
        
    # In reality, this would call our AI gateway with the extracted text from the PDF
    profile.ai_summary = "AI-generated summary: Strong candidate with 5 years of experience."
    profile.skills = ["React", "TypeScript", "FastAPI"]
    
    db.commit()

@router.post("/candidates/{candidate_id}/parse-resume", tags=["ATS AI Features"])
async def parse_resume(candidate_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Trigger the AI extraction background job."""
    candidate = db.query(ATSCandidate).filter(ATSCandidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    background_tasks.add_task(_parse_resume_background_task, candidate_id, db)
    return {"success": True, "message": "Resume parsing job started"}

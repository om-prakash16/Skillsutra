from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from core.database import get_db_session
from models.resume import Resume, ResumeVersion
from schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse, AISectionRewriteRequest, AISectionRewriteResponse
from core.dependencies import get_current_user
import json
import hashlib

router = APIRouter(prefix="/resumes", tags=["AI Resume Builder"])

@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    resume_in: ResumeCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new resume."""
    new_resume = Resume(
        user_id=current_user["id"],
        **resume_in.dict()
    )
    db.add(new_resume)
    await db.commit()
    await db.refresh(new_resume)
    
    # Save the first version
    initial_version = ResumeVersion(
        resume_id=new_resume.id,
        content_snapshot=new_resume.content,
        version_hash=hashlib.md5(json.dumps(new_resume.content, sort_keys=True).encode()).hexdigest()
    )
    db.add(initial_version)
    await db.commit()
    
    return new_resume

@router.get("/", response_model=List[ResumeResponse])
async def list_resumes(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """List all resumes for the current user."""
    stmt = select(Resume).where(Resume.user_id == UUID(current_user["id"])).order_by(Resume.updated_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Get a specific resume."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == UUID(current_user["id"]))
    result = await db.execute(stmt)
    resume = result.scalars().first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.patch("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: UUID,
    resume_update: ResumeUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Update resume with autosave capabilities and versioning trigger."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == UUID(current_user["id"]))
    result = await db.execute(stmt)
    resume = result.scalars().first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    update_data = resume_update.dict(exclude_unset=True)
    
    # Check if content changed significantly to create a version
    content_changed = "content" in update_data and update_data["content"] != resume.content

    for key, value in update_data.items():
        setattr(resume, key, value)
        
    await db.commit()
    await db.refresh(resume)
    
    if content_changed:
        # Save a new version snapshot
        new_version = ResumeVersion(
            resume_id=resume.id,
            content_snapshot=resume.content,
            version_hash=hashlib.md5(json.dumps(resume.content, sort_keys=True).encode()).hexdigest()
        )
        db.add(new_version)
        await db.commit()

    return resume

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Delete a resume."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == UUID(current_user["id"]))
    result = await db.execute(stmt)
    resume = result.scalars().first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    await db.delete(resume)
    await db.commit()
    
@router.post("/{resume_id}/ai/rewrite", response_model=AISectionRewriteResponse)
async def ai_rewrite_section(
    resume_id: UUID,
    request: AISectionRewriteRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Mock AI Endpoint to rewrite a section of the resume. 
    In production, this would trigger a Celery task or an LLM chain.
    """
    # MOCK LLM BEHAVIOR
    return AISectionRewriteResponse(
        rewritten_content=f"[AI Enhanced ({request.focus})]: {request.section_content}",
        suggestions=[
            "Quantify your impact with metrics (e.g. 'improved performance by 20%')",
            "Use stronger action verbs."
        ]
    )

@router.post("/{resume_id}/export/pdf")
async def export_resume_pdf(
    resume_id: UUID,
    current_user: dict = Depends(get_current_user)
):
    """
    Mock endpoint that would trigger the Puppeteer PDF generation microservice.
    """
    return {"status": "processing", "download_url": "https://s3.amazonaws.com/mock-bucket/resume.pdf"}

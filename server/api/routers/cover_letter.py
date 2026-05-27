from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from core.database import get_db_session
from models.cover_letter import CoverLetter
from schemas.cover_letter import CoverLetterCreate, CoverLetterUpdate, CoverLetterResponse, AIGenerateRequest, AIRewriteRequest
from core.dependencies import get_current_user

router = APIRouter(prefix="/cover-letters", tags=["AI Cover Letter Generator"])

@router.post("/", response_model=CoverLetterResponse, status_code=status.HTTP_201_CREATED)
async def create_cover_letter(
    letter_in: CoverLetterCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new cover letter draft."""
    new_letter = CoverLetter(
        user_id=current_user["id"],
        **letter_in.dict()
    )
    db.add(new_letter)
    await db.commit()
    await db.refresh(new_letter)
    return new_letter

@router.get("/", response_model=List[CoverLetterResponse])
async def list_cover_letters(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """List all cover letters for the current user."""
    stmt = select(CoverLetter).where(CoverLetter.user_id == UUID(current_user["id"])).order_by(CoverLetter.updated_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{letter_id}", response_model=CoverLetterResponse)
async def get_cover_letter(
    letter_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Get a specific cover letter."""
    stmt = select(CoverLetter).where(CoverLetter.id == letter_id, CoverLetter.user_id == UUID(current_user["id"]))
    result = await db.execute(stmt)
    letter = result.scalars().first()
    
    if not letter:
        raise HTTPException(status_code=404, detail="Cover letter not found")
    return letter

@router.patch("/{letter_id}", response_model=CoverLetterResponse)
async def update_cover_letter(
    letter_id: UUID,
    letter_update: CoverLetterUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Update a cover letter draft."""
    stmt = select(CoverLetter).where(CoverLetter.id == letter_id, CoverLetter.user_id == UUID(current_user["id"]))
    result = await db.execute(stmt)
    letter = result.scalars().first()
    
    if not letter:
        raise HTTPException(status_code=404, detail="Cover letter not found")

    update_data = letter_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(letter, key, value)
        
    await db.commit()
    await db.refresh(letter)
    return letter

@router.delete("/{letter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cover_letter(
    letter_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Delete a cover letter."""
    stmt = select(CoverLetter).where(CoverLetter.id == letter_id, CoverLetter.user_id == UUID(current_user["id"]))
    result = await db.execute(stmt)
    letter = result.scalars().first()
    
    if not letter:
        raise HTTPException(status_code=404, detail="Cover letter not found")
        
    await db.delete(letter)
    await db.commit()
    
@router.post("/generate", response_model=CoverLetterResponse)
async def ai_generate_cover_letter(
    request: AIGenerateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Mock AI Endpoint to generate a complete cover letter from scratch based on a Resume and Job Description.
    """
    mock_content = f"Dear Hiring Manager,\n\nI am writing to express my {request.tone.lower()} interest in the position. With my background detailed in my resume, I believe I am a strong fit.\n\nSincerely,\nCandidate"
    
    new_letter = CoverLetter(
        user_id=current_user["id"],
        resume_id=request.resume_id,
        job_id=request.job_id,
        title=f"AI Generated - {request.tone}",
        content_markdown=mock_content,
        tone=request.tone
    )
    db.add(new_letter)
    await db.commit()
    await db.refresh(new_letter)
    return new_letter

@router.post("/{letter_id}/ai/rewrite")
async def ai_rewrite_cover_letter(
    letter_id: UUID,
    request: AIRewriteRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Mock AI Endpoint to fix grammar or alter tone.
    """
    return {
        "rewritten_content": f"[AI Rewritten ({request.focus}, {request.tone})]: {request.content_markdown}"
    }

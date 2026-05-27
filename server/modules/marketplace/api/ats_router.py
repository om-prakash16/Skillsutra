from fastapi import APIRouter, Depends, Body, Path, Query
from typing import Dict, Any, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.response import success_response
from core.database import get_db_session
from modules.auth.core.service import get_current_user
from modules.auth.core.dependencies import RoleChecker
from modules.marketplace.core.ats_state_machine import AtsStateMachine

from models.ats import JobAtsStage, ApplicationNote
from schemas.ats import StageCreate, ApplicationMove, ApplicationNoteCreate, ApplicationResponse

router = APIRouter(prefix="/ats", tags=["ATS & Pipeline Workflow"])
require_recruiter = RoleChecker(["RECRUITER", "SUPER_ADMIN"])

@router.post("/jobs/{job_id}/stages")
async def create_ats_stage(
    job_id: UUID,
    payload: StageCreate,
    current_user: dict = Depends(get_current_user),
    auth_guard = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session)
):
    """Define a custom ATS pipeline stage for a specific job."""
    stage = JobAtsStage(
        job_id=job_id,
        name=payload.name,
        order_index=payload.order_index
    )
    db.add(stage)
    await db.commit()
    await db.refresh(stage)
    
    return success_response(data={"id": str(stage.id), "name": stage.name, "order_index": stage.order_index})

@router.patch("/applications/{application_id}/move")
async def move_application_stage(
    application_id: UUID,
    payload: ApplicationMove,
    current_user: dict = Depends(get_current_user),
    auth_guard = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Moves an application to a new stage using the AtsStateMachine.
    Publishes real-time WS events upon success.
    """
    state_machine = AtsStateMachine(db)
    actor_id = UUID(current_user["id"])
    
    application = await state_machine.move_candidate(
        application_id=application_id,
        new_stage_id=payload.new_stage_id,
        actor_id=actor_id,
        reason=payload.reason
    )
    
    # In a full EDA (Event-Driven Architecture), we would trigger Celery here:
    # from modules.marketplace.workers.ats_tasks import notify_stage_change
    # notify_stage_change.delay(str(application.id))
    
    return success_response(data={"application_id": str(application.id), "new_stage_id": str(payload.new_stage_id)}, message="Candidate moved successfully")

@router.patch("/applications/{application_id}/status")
async def update_application_status(
    application_id: UUID,
    status: str = Body(..., embed=True),
    reason: str = Body(None, embed=True),
    current_user: dict = Depends(get_current_user),
    auth_guard = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session)
):
    """Update global candidate status (e.g., REJECTED, HIRED)."""
    state_machine = AtsStateMachine(db)
    actor_id = UUID(current_user["id"])
    
    application = await state_machine.update_status(
        application_id=application_id,
        new_status=status,
        actor_id=actor_id,
        reason=reason
    )
    return success_response(data={"application_id": str(application.id), "status": application.status})

@router.post("/applications/{application_id}/notes")
async def add_application_note(
    application_id: UUID,
    payload: ApplicationNoteCreate,
    current_user: dict = Depends(get_current_user),
    auth_guard = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session)
):
    """Add a collaboration note (e.g. interview feedback) to an application."""
    actor_id = UUID(current_user["id"])
    note = ApplicationNote(
        application_id=application_id,
        author_id=actor_id,
        content=payload.content,
        visibility=payload.visibility
    )
    db.add(note)
    await db.commit()
    await db.refresh(note)
    
    return success_response(data={"id": str(note.id), "content": note.content}, message="Application note added")

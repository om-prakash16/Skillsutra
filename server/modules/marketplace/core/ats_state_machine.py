from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from fastapi import HTTPException

from models.ats import Application, JobAtsStage, AtsAuditLog
from core.exceptions import AppException
import logging

logger = logging.getLogger(__name__)

class AtsStateMachine:
    """
    Enforces strict transitions between Job ATS Stages for an Application.
    Writes audit logs on every successful transition.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    async def move_candidate(
        self, 
        application_id: UUID, 
        new_stage_id: UUID, 
        actor_id: UUID,
        reason: str = None
    ) -> Application:
        # 1. Fetch Application
        stmt = select(Application).where(Application.id == application_id)
        result = await self.db.execute(stmt)
        application = result.scalars().first()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
            
        # 2. Fetch New Stage
        stmt_stage = select(JobAtsStage).where(JobAtsStage.id == new_stage_id)
        result_stage = await self.db.execute(stmt_stage)
        new_stage = result_stage.scalars().first()
        
        if not new_stage:
            raise HTTPException(status_code=404, detail="Target stage not found")
            
        # 3. Validation
        if application.job_id != new_stage.job_id:
            raise AppException(message="Target stage does not belong to the same job", code="invalid_stage", status_code=400)
            
        if application.current_stage_id == new_stage.id:
            raise AppException(message="Application is already in this stage", code="duplicate_stage", status_code=400)
            
        # 4. Record Audit Log
        previous_stage_id = application.current_stage_id
        
        audit_log = AtsAuditLog(
            application_id=application.id,
            actor_id=actor_id,
            action="MOVED_STAGE",
            previous_state={"stage_id": str(previous_stage_id) if previous_stage_id else None},
            new_state={"stage_id": str(new_stage.id), "reason": reason}
        )
        self.db.add(audit_log)
        
        # 5. Transition
        application.current_stage_id = new_stage.id
        
        try:
            await self.db.commit()
            await self.db.refresh(application)
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to move candidate {application.candidate_id}: {e}")
            raise AppException(message="Failed to move candidate", code="db_error", status_code=500)
            
        # Note: Event publishing (ApplicationStageChanged) would happen here
        # For decoupled architecture, we rely on Celery tasks triggered after HTTP request
        
        return application

    async def update_status(
        self,
        application_id: UUID,
        new_status: str, # e.g. 'REJECTED', 'HIRED', 'WITHDRAWN'
        actor_id: UUID,
        reason: str = None
    ) -> Application:
        stmt = select(Application).where(Application.id == application_id)
        result = await self.db.execute(stmt)
        application = result.scalars().first()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
            
        valid_statuses = ["ACTIVE", "REJECTED", "WITHDRAWN", "HIRED"]
        if new_status not in valid_statuses:
            raise AppException(message=f"Invalid status. Must be one of {valid_statuses}", code="invalid_status", status_code=400)
            
        old_status = application.status
        application.status = new_status
        
        audit_log = AtsAuditLog(
            application_id=application.id,
            actor_id=actor_id,
            action="STATUS_CHANGED",
            previous_state={"status": old_status},
            new_state={"status": new_status, "reason": reason}
        )
        self.db.add(audit_log)
        
        await self.db.commit()
        await self.db.refresh(application)
        
        return application

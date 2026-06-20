import logging
from fastapi import Request, Depends
from sqlalchemy.orm import Session
from core.database import get_db_session as get_db
from models.compliance import AuditLog

logger = logging.getLogger(__name__)

async def write_audit_log(
    action: str, 
    target: str, 
    request: Request, 
    db: Session, 
    payload: dict = None
):
    """
    Utility function to write an immutable audit log to Postgres.
    Used by the audit_trail dependency.
    """
    try:
        # Extract actor if available (from request state, assuming auth middleware set it)
        actor_id = None
        if hasattr(request.state, "user"):
            actor_id = request.state.user.id
            
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

        log = AuditLog(
            actor_id=actor_id,
            action=action,
            target_resource=target,
            payload_after=payload,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(log)
        db.commit()
    except Exception as e:
        logger.error(f"FAILED TO WRITE AUDIT LOG: {e}")
        # In a strict SOC-2 environment, if the audit log fails, you must fail the request.
        # We will just log the error here to prevent taking down the platform during DB spikes.

class AuditTrail:
    """
    FastAPI Dependency to automatically log requests to sensitive endpoints.
    Usage: @router.post("/billing", dependencies=[Depends(AuditTrail("BILLING_UPDATED"))])
    """
    def __init__(self, action_name: str):
        self.action_name = action_name

    async def __call__(self, request: Request, db: Session = Depends(get_db)):
        target_resource = str(request.url.path)
        
        # Log the attempt BEFORE it finishes (or after, depending on preference)
        # For full accuracy, it's often better to log in a BackgroundTask, but for 
        # demonstration we run it inline.
        await write_audit_log(self.action_name, target_resource, request, db)
        
        return True

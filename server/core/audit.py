from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request
from models.iam import SecurityEvent
from datetime import datetime, timezone
import logging

class AuditLogger:
    """
    Automatically logs critical security events to the SecurityEvent table.
    """

    @staticmethod
    async def log_event(
        db: AsyncSession,
        user_id: str,
        event_type: str,
        request: Request = None,
        severity: str = "info",
        metadata: dict = None
    ):
        ip_address = None
        user_agent = None
        
        if request:
            ip_address = request.client.host if request.client else "unknown"
            user_agent = request.headers.get("User-Agent", "unknown")

        event = SecurityEvent(
            user_id=user_id,
            event_type=event_type,
            ip_address=ip_address,
            user_agent=user_agent,
            severity=severity,
            event_metadata=metadata or {}
        )
        db.add(event)
        
        try:
            await db.commit()
        except Exception as e:
            # We don't want a logging failure to crash the request
            logging.error(f"Failed to write SecurityEvent to DB: {e}")
            await db.rollback()

    @staticmethod
    async def log_denied(db: AsyncSession, user_id: str, resource_action: str, request: Request):
        await AuditLogger.log_event(
            db=db,
            user_id=user_id,
            event_type="permission_denied",
            request=request,
            severity="warning",
            metadata={"resource_action": resource_action}
        )
        
    @staticmethod
    async def log_login(db: AsyncSession, user_id: str, request: Request, method: str = "password"):
        await AuditLogger.log_event(
            db=db,
            user_id=user_id,
            event_type=f"login_success_{method}",
            request=request,
            severity="info"
        )

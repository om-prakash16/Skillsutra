from typing import Dict, Any
from fastapi import Depends
import db.engine as engine
from core.exceptions import AuthorizationError, ExternalServiceError
from modules.auth.core.service import get_current_user
from core.database import get_db_session

async def get_db():
    """Returns the custom database client instance (Legacy)."""
    if not engine.db_client:
        raise ExternalServiceError(
            message="Database connection is unavailable",
            details={"service": "database"}
        )
    return engine.db_client

async def get_current_user_id(user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """Returns the ID of the currently authenticated user."""
    user_id = user.get("id")
    if not user_id:
        raise AuthorizationError(message="Invalid authentication payload")
    return str(user_id)

async def get_validated_wallet(user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """Since Blockchain is removed, this simply returns the authenticated user's ID."""
    user_id = user.get("id") or user.get("sub")
    if not user_id:
        raise AuthorizationError(message="No authenticated user ID found.")
    return str(user_id)

async def get_company_id(
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
) -> str:
    """
    Retrieves the company ID associated with the current user.
    Uses async execution for performance.
    """
    res = await db.table("companies").select("id").eq("created_by_user_id", user_id).limit(1).execute()
    if not res.data:
        raise AuthorizationError(
            message="No company profile found. You must register as a company first."
        )
    return str(res.data[0]["id"])

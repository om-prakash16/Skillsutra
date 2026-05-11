from typing import Optional, Dict, Any
from fastapi import Depends
from db.engine import db_client
from core.exceptions import AuthorizationError, ExternalServiceError
from modules.auth.core.service import get_current_user

async def get_db():
    """Returns the database client instance."""
    if not db_client:
        raise ExternalServiceError(
            message="Database connection is unavailable",
            details={"service": "supabase"}
        )
    return db_client

async def get_current_user_id(user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """Returns the ID of the currently authenticated user."""
    user_id = user.get("id")
    if not user_id:
        raise AuthorizationError(message="Invalid authentication payload")
    return str(user_id)

async def get_validated_wallet(user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """Extracts and validates the Solana wallet address from the authenticated user."""
    wallet = user.get("wallet_address") or user.get("metadata", {}).get("wallet_address")
    
    if not wallet:
        # Fallback: look up wallet from the database
        db = await get_db()
        user_id = user.get("id")
        if user_id:
            res = await db.table("users").select("wallet_address").eq("id", str(user_id)).limit(1).execute()
            if res.data and res.data[0].get("wallet_address"):
                wallet = res.data[0]["wallet_address"]
    
    if not wallet:
        raise AuthorizationError(
            message="No wallet address associated with this account. Please link a Solana wallet."
        )
    
    # Basic validation: Solana addresses are base58-encoded, 32-44 chars
    if not (32 <= len(wallet) <= 44):
        raise AuthorizationError(message="Invalid wallet address format")
    
    return wallet

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

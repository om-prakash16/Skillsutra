from fastapi import APIRouter, Depends, Request, HTTPException, status
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from core.database import get_db_session
from modules.auth.core.service import get_current_user
from modules.auth.core.mfa_service import MFAService

router = APIRouter()

class MFAVerifyRequest(BaseModel):
    code: str

@router.post("/setup")
async def setup_mfa(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Initiates TOTP setup. Returns the secret key and a Base64 QR code image.
    """
    user_id = current_user.get("id") or current_user.get("sub")
    email = current_user.get("email", f"user-{user_id}@skillsutra.com")
    
    service = MFAService(db)
    secret, qr_base64 = await service.setup_totp(str(user_id), email)
    
    return {
        "status": "success",
        "secret": secret,
        "qr_code_url": qr_base64
    }

@router.post("/verify")
async def verify_mfa_setup(
    data: MFAVerifyRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Verifies the first TOTP code and fully enables MFA. Returns backup codes.
    """
    user_id = current_user.get("id") or current_user.get("sub")
    service = MFAService(db)
    
    backup_codes = await service.verify_and_enable_totp(str(user_id), data.code)
    
    return {
        "status": "success",
        "message": "MFA has been successfully enabled.",
        "backup_codes": backup_codes
    }

@router.post("/disable")
async def disable_mfa(
    data: MFAVerifyRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Disables MFA (requires a valid code to prove identity before disabling).
    """
    user_id = str(current_user.get("id") or current_user.get("sub"))
    service = MFAService(db)
    
    # Must provide a valid code to disable
    is_valid = await service.verify_totp_login(user_id, data.code)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid verification code")
        
    from sqlalchemy import select
    from models.iam import MFAMethod, BackupCode
    
    # Delete MFA method
    query = select(MFAMethod).where(MFAMethod.user_id == user_id)
    methods = (await db.execute(query)).scalars().all()
    for m in methods:
        await db.delete(m)
        
    # Delete Backup Codes
    query = select(BackupCode).where(BackupCode.user_id == user_id)
    codes = (await db.execute(query)).scalars().all()
    for c in codes:
        await db.delete(c)
        
    await db.commit()
    
    return {"status": "success", "message": "MFA has been disabled."}

@router.get("/status")
async def mfa_status(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Checks if MFA is currently enabled.
    """
    user_id = current_user.get("id") or current_user.get("sub")
    from sqlalchemy import select
    from models.iam import MFAMethod
    
    query = select(MFAMethod).where(MFAMethod.user_id == str(user_id), MFAMethod.is_enabled == True)
    res = await db.execute(query)
    method = res.scalars().first()
    
    return {
        "is_enabled": method is not None,
        "method": method.method_type if method else None
    }

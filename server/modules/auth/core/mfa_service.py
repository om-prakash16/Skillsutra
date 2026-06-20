import pyotp
import qrcode
import io
import base64
import secrets
from typing import Tuple, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from fastapi import HTTPException

from models.iam import MFAMethod, BackupCode
from core.security import hash_token

class MFAService:
    """
    Handles Multi-Factor Authentication logic (TOTP and Backup Codes).
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    def generate_totp_secret(self) -> str:
        """Generates a random base32 string for TOTP."""
        return pyotp.random_base32()

    def generate_qr_code(self, secret: str, email: str, issuer_name: str = "SkillSutra Enterprise") -> str:
        """
        Generates a Base64-encoded QR code image of the TOTP provisioning URI.
        """
        provisioning_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name=issuer_name)
        
        qr = qrcode.make(provisioning_uri)
        buf = io.BytesIO()
        qr.save(buf, format="PNG")
        qr_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        return f"data:image/png;base64,{qr_b64}"

    async def setup_totp(self, user_id: str, email: str) -> Tuple[str, str]:
        """
        Initializes TOTP setup. Creates a pending DB record and returns the secret & QR code.
        """
        # Check if already enabled
        query = select(MFAMethod).where(MFAMethod.user_id == user_id, MFAMethod.method_type == "totp")
        res = await self.db.execute(query)
        existing = res.scalars().first()
        
        if existing and existing.is_enabled:
            raise HTTPException(status_code=400, detail="TOTP is already enabled for this user.")

        secret = self.generate_totp_secret()
        qr_base64 = self.generate_qr_code(secret, email)

        if existing:
            # Update pending secret
            existing.secret_hash = secret # Note: normally this would be encrypted with a KMS key
            existing.is_enabled = False
        else:
            new_method = MFAMethod(
                user_id=user_id,
                method_type="totp",
                is_enabled=False,
                secret_hash=secret
            )
            self.db.add(new_method)
            
        await self.db.commit()
        return secret, qr_base64

    async def verify_and_enable_totp(self, user_id: str, code: str) -> List[str]:
        """
        Verifies the user's first TOTP code and fully enables MFA.
        Returns a list of 10 backup recovery codes.
        """
        query = select(MFAMethod).where(MFAMethod.user_id == user_id, MFAMethod.method_type == "totp")
        res = await self.db.execute(query)
        method = res.scalars().first()

        if not method or not method.secret_hash:
            raise HTTPException(status_code=400, detail="TOTP setup has not been initiated.")

        totp = pyotp.TOTP(method.secret_hash)
        if not totp.verify(code):
            raise HTTPException(status_code=400, detail="Invalid verification code.")

        method.is_enabled = True
        method.is_primary = True
        
        # Generate 10 Backup Codes
        backup_codes = []
        for _ in range(10):
            code_plain = secrets.token_hex(4) # 8 character hex
            backup_codes.append(code_plain)
            
            bc = BackupCode(
                user_id=user_id,
                code_hash=hash_token(code_plain),
                is_used=False
            )
            self.db.add(bc)
            
        await self.db.commit()
        
        return backup_codes

    async def verify_totp_login(self, user_id: str, code: str) -> bool:
        """
        Verifies a TOTP code during the login flow.
        """
        query = select(MFAMethod).where(MFAMethod.user_id == user_id, MFAMethod.method_type == "totp", MFAMethod.is_enabled == True)
        res = await self.db.execute(query)
        method = res.scalars().first()

        if not method:
            raise HTTPException(status_code=400, detail="MFA is not enabled for this user.")

        totp = pyotp.TOTP(method.secret_hash)
        is_valid = totp.verify(code)
        
        if is_valid:
            method.last_used_at = datetime.now(timezone.utc)
            await self.db.commit()
            
        return is_valid

    async def verify_backup_code(self, user_id: str, code: str, ip_address: str = None) -> bool:
        """
        Verifies a one-time backup code and marks it as used.
        """
        hashed_code = hash_token(code)
        query = select(BackupCode).where(BackupCode.user_id == user_id, BackupCode.code_hash == hashed_code, BackupCode.is_used == False)
        res = await self.db.execute(query)
        backup_code = res.scalars().first()
        
        if not backup_code:
            return False
            
        backup_code.is_used = True
        backup_code.used_at = datetime.now(timezone.utc)
        backup_code.used_from_ip = ip_address
        
        await self.db.commit()
        return True

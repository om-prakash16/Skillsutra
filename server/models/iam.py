from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from core.database import Base
from models.mixins import EnterpriseMixin

class Device(EnterpriseMixin, Base):
    """
    Tracks physical/virtual devices used by users to access the platform.
    Used for impossible travel detection, unrecognized device alerts, and auditing.
    """
    __tablename__ = "devices"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    device_name = Column(String, nullable=True) # e.g. "Om's iPhone"
    device_type = Column(String, nullable=True) # desktop, mobile, tablet
    os_name = Column(String, nullable=True) # macOS, iOS, Windows
    browser_name = Column(String, nullable=True) # Chrome, Safari
    
    fingerprint = Column(String, nullable=False, index=True) # Hash of device characteristics
    
    last_ip_address = Column(String, nullable=True)
    last_location = Column(JSONB, nullable=True) # { "city": "...", "country": "..." }
    last_active_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    is_trusted = Column(Boolean, default=False)
    is_blocked = Column(Boolean, default=False)

    user = relationship("User")





class APIKey(EnterpriseMixin, Base):
    """
    Personal Access Tokens (PATs) or Machine-to-Machine Service Tokens.
    """
    __tablename__ = "api_keys"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String, nullable=False)
    key_hash = Column(String, nullable=False, unique=True)
    prefix = Column(String, nullable=False) # e.g. "sk_live_1234"
    
    scopes = Column(JSONB, default=list) # e.g. ["read:users", "write:cms"]
    
    expires_at = Column(DateTime(timezone=True), nullable=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    
    is_active = Column(Boolean, default=True)

    user = relationship("User")





class MFAMethod(EnterpriseMixin, Base):
    """
    Stores Multi-Factor Authentication configurations for a user.
    Handles TOTP secrets, Email OTP preferences, etc.
    """
    __tablename__ = "mfa_methods"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    method_type = Column(String, nullable=False) # e.g. "totp", "email", "sms"
    is_primary = Column(Boolean, default=False)
    is_enabled = Column(Boolean, default=False)
    
    # Encrypted secrets. NEVER stored in plaintext.
    secret_hash = Column(String, nullable=True) 
    
    last_used_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")


class BackupCode(EnterpriseMixin, Base):
    """
    Stores hashed, one-time-use recovery codes for MFA bypass.
    """
    __tablename__ = "backup_codes"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    code_hash = Column(String, nullable=False) # Hashed using bcrypt or sha256
    is_used = Column(Boolean, default=False)
    
    used_at = Column(DateTime(timezone=True), nullable=True)
    used_from_ip = Column(String, nullable=True)

    user = relationship("User")




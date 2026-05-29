import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class TrustedDevice(Base):
    __tablename__ = "trusted_devices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    device_id = Column(String, nullable=False, index=True)
    device_name = Column(String, nullable=True)
    browser = Column(String, nullable=True)
    os = Column(String, nullable=True)
    device_type = Column(String, nullable=True)
    fingerprint_hash = Column(String, nullable=False, unique=True)
    trusted_status = Column(Boolean, default=True)
    first_seen = Column(DateTime(timezone=True), default=datetime.utcnow)
    last_seen = Column(DateTime(timezone=True), default=datetime.utcnow)

class LoginHistory(Base):
    __tablename__ = "login_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    device_id = Column(String, nullable=True, index=True)
    login_time = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    ip_address = Column(String, nullable=True)
    location_data = Column(JSONB, nullable=True)
    method = Column(String, nullable=False) # e.g. "password", "google", "magic_link"
    status = Column(String, nullable=False) # "success" or "failure"

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String, nullable=False, index=True)
    severity = Column(String, nullable=True, index=True)
    description = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    device_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class AccountRecovery(Base):
    __tablename__ = "account_recovery"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    recovery_email = Column(String, nullable=True)
    recovery_phone = Column(String, nullable=True)
    two_factor_enabled = Column(Boolean, default=False)
    backup_codes = Column(JSONB, nullable=True)

class PrivacySettings(Base):
    __tablename__ = "privacy_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    profile_visibility = Column(String, default="PUBLIC") # PUBLIC, RECRUITER, PRIVATE
    hide_email = Column(Boolean, default=False)
    hide_contact = Column(Boolean, default=False)
    hide_location = Column(Boolean, default=False)
    search_visibility = Column(Boolean, default=True)
    discovery_visibility = Column(Boolean, default=True)


class SecurityScore(Base):
    __tablename__ = "security_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    score = Column(Integer, default=0)
    last_calculated = Column(DateTime(timezone=True), default=datetime.utcnow)
    factors = Column(JSONB, nullable=True)

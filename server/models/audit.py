import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True) # Who performed the action
    action = Column(String, nullable=False) # e.g. "USER_BANNED", "JOB_DELETED"
    
    resource_type = Column(String, nullable=True) # e.g. "USER", "COMPANY", "CMS_PAGE"
    resource_id = Column(String, nullable=True) 
    
    details = Column(JSONB, default=dict) # The before/after diff or payload
    
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class SecurityEvent(Base):
    __tablename__ = "audit_security_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String, nullable=False) # e.g. "BRUTE_FORCE", "FAILED_LOGIN"
    source_ip = Column(String, nullable=True)
    target_user_id = Column(UUID(as_uuid=True), nullable=True)
    
    status = Column(String, default="LOGGED") # LOGGED, FLAGGED, BLOCKED, VERIFIED
    severity = Column(String, default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    
    event_metadata = Column("metadata", JSONB, default=dict) # e.g. location, device mismatch data
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

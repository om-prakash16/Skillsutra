import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class AuditLog(Base):
    """
    Immutable ledger of all critical actions on the platform.
    Required for SOC-2 / ISO-27001 compliance.
    """
    __tablename__ = "compliance_audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True) # Who did it
    
    action = Column(String, nullable=False) # e.g. "USER_DELETED", "BILLING_UPDATED"
    target_resource = Column(String, nullable=False) # e.g. "users/123"
    
    payload_before = Column(JSONB, nullable=True) # State before action
    payload_after = Column(JSONB, nullable=True) # State after action
    
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow)



class ComplianceRecord(Base):
    """
    Tracks GDPR/CCPA user requests for Data Export or Data Deletion.
    """
    __tablename__ = "compliance_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    request_type = Column(String, nullable=False) # "DATA_EXPORT", "ACCOUNT_DELETION"
    status = Column(String, default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED
    
    # Under GDPR, we have 30 days to process these requests.
    due_date = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Store the S3 URI of their exported data if applicable
    export_uri = Column(String, nullable=True) 
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

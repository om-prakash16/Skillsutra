import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import UUID

class EnterpriseMixin:
    """
    Standardizes database models with Enterprise architecture requirements.
    Every major table should inherit this mixin.
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True, index=True) # Soft reference to Organizations.id
    workspace_id = Column(UUID(as_uuid=True), nullable=True, index=True) # Soft reference to Workspace
    owner_id = Column(UUID(as_uuid=True), nullable=True, index=True) # Soft reference to User who owns the record
    
    # Audit Tracking
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True, index=True) # Soft delete
    
    created_by = Column(UUID(as_uuid=True), nullable=True) # Soft reference to Users.id
    updated_by = Column(UUID(as_uuid=True), nullable=True)
    deleted_by = Column(UUID(as_uuid=True), nullable=True)
    
    # Optimistic Locking / Versioning
    version = Column(Integer, default=1, nullable=False)
    
    # Workflow & Approval
    approval_status = Column(String(50), default="draft", index=True) # e.g. draft, pending, approved, rejected
    workflow_status = Column(String(50), default="initial", index=True) # Custom workflow steps
    
    # Metadata & Integrations
    from sqlalchemy.dialects.postgresql import JSONB
    tags = Column(JSONB, default=list) # Array of strings or dicts
    ai_metadata = Column(JSONB, default=dict) # To store AI generated summaries, embeddings refs, etc.
    search_index_status = Column(String(50), default="pending") # pending, indexed, failed

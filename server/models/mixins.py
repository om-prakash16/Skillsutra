import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID

class EnterpriseMixin:
    """
    Standardizes database models with Enterprise architecture requirements.
    Every major table should inherit this mixin.
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True, index=True) # Soft reference to Organizations.id
    
    # Audit Tracking
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True, index=True) # Soft delete
    
    created_by = Column(UUID(as_uuid=True), nullable=True) # Soft reference to Users.id
    updated_by = Column(UUID(as_uuid=True), nullable=True)
    
    # Optimistic Locking / Versioning
    version = Column(Integer, default=1, nullable=False)

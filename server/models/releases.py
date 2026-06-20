import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float
from sqlalchemy.dialects.postgresql import UUID
from core.database import Base

class Deployment(Base):
    """
    Tracks historical production deployments and rollbacks.
    """
    __tablename__ = "deployments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    version_tag = Column(String, nullable=False) # e.g. "v1.4.2"
    commit_hash = Column(String, nullable=False)
    author = Column(String, nullable=True) # GitHub username
    
    status = Column(String, default="SUCCESS") # SUCCESS, FAILED, ROLLED_BACK
    environment = Column(String, default="production") # staging, production
    
    release_notes = Column(String, nullable=True)
    
    deployed_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class BackupHistory(Base):
    """
    Tracks automated database and file storage backups.
    Critical for Disaster Recovery Verification.
    """
    __tablename__ = "backup_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    backup_type = Column(String, nullable=False) # "POSTGRES", "S3_BUCKET"
    status = Column(String, default="COMPLETED") # COMPLETED, FAILED, IN_PROGRESS
    
    size_mb = Column(Float, nullable=True)
    storage_uri = Column(String, nullable=False) # Where the backup is located
    
    started_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    error_log = Column(String, nullable=True)

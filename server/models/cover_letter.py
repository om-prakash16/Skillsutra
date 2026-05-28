import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from core.database import Base
import models.ats
import models.user
import models.resume

class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    resume_id = Column(UUID(as_uuid=True), ForeignKey('resumes.id', ondelete='SET NULL'), nullable=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey('jobs.id', ondelete='SET NULL'), nullable=True)
    
    title = Column(String, nullable=False) # e.g., "Software Engineer - Stripe"
    content_markdown = Column(Text, nullable=True)
    
    tone = Column(String, default="PROFESSIONAL")
    status = Column(String, default="DRAFT") # DRAFT, FINALIZED
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User")
    resume = relationship("Resume")
    job = relationship("Job")

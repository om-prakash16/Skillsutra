import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False) # e.g., "Frontend Developer Resume - Google"
    is_primary = Column(Boolean, default=False)
    template_id = Column(String, default="modern")
    
    # Colors, typography, spacing preferences
    design_settings = Column(JSONB, default=dict)
    
    # The raw, structured payload of the resume (sections, bullet points, ordering)
    content = Column(JSONB, default=dict)
    
    # Computed score against general ATS parsers
    ats_score = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User")
    versions = relationship("ResumeVersion", back_populates="resume", cascade="all, delete-orphan", order_by="desc(ResumeVersion.created_at)")
    exports = relationship("ResumeExport", back_populates="resume", cascade="all, delete-orphan", order_by="desc(ResumeExport.created_at)")


class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id = Column(UUID(as_uuid=True), ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False)
    
    version_hash = Column(String, nullable=True)
    content_snapshot = Column(JSONB, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="versions")


class ResumeExport(Base):
    __tablename__ = "resume_exports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id = Column(UUID(as_uuid=True), ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False)
    
    # PDF, DOCX, TXT
    format = Column(String, nullable=False)
    
    s3_url = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="exports")

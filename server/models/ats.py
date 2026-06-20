import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, JSON, Boolean, ForeignKey, Text, Float, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from database.core import Base
from .mixins import EnterpriseMixin
import models.core
import models.user

# --- Organizations & Taxonomies ---

class ATSDepartment(EnterpriseMixin, Base):
    __tablename__ = "ats_departments"
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

class ATSLocation(EnterpriseMixin, Base):
    __tablename__ = "ats_locations"
    name = Column(String(255), nullable=False) # e.g. "New York Office" or "Remote - EU"
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    is_remote = Column(Boolean, default=False)

# --- Pipelines ---

class ATSPipeline(EnterpriseMixin, Base):
    __tablename__ = "ats_pipelines"
    name = Column(String(255), nullable=False) # e.g. "Standard Engineering Pipeline"
    is_default = Column(Boolean, default=False)
    stages = relationship("ATSPipelineStage", back_populates="pipeline", order_by="ATSPipelineStage.order_index")

class ATSPipelineStage(EnterpriseMixin, Base):
    __tablename__ = "ats_pipeline_stages"
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("ats_pipelines.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False) # "Applied", "Screening", "Interview", "Offer"
    order_index = Column(Integer, default=0)
    category = Column(String(50), default="active") # active, hired, rejected
    
    pipeline = relationship("ATSPipeline", back_populates="stages")

# --- Jobs ---

class ATSJobTemplate(EnterpriseMixin, Base):
    __tablename__ = "ats_job_templates"
    title = Column(String(255), nullable=False)
    description_template = Column(Text, nullable=False)
    requirements_template = Column(Text, nullable=True)

class ATSJob(EnterpriseMixin, Base):
    __tablename__ = "ats_jobs"
    
    title = Column(String(255), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("ats_departments.id", ondelete="SET NULL"), nullable=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("ats_locations.id", ondelete="SET NULL"), nullable=True)
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("ats_pipelines.id", ondelete="SET NULL"), nullable=True)
    
    status = Column(String(50), default="draft") # draft, published, internal, closed
    employment_type = Column(String(50), default="full-time") # full-time, contract, internship
    
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    
    # Compensation
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    currency = Column(String(10), default="USD")
    
    # Custom Application Form Config (JSON Schema)
    application_form_schema = Column(JSON, default=dict)
    
    # AI Embeddings for Matching
    embedding = Column(Vector(768), nullable=True)
    
    applications = relationship("ATSApplication", back_populates="job", cascade="all, delete-orphan")

# --- Candidates & Applications ---

class ATSCandidate(EnterpriseMixin, Base):
    __tablename__ = "ats_candidates"
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    phone = Column(String(50), nullable=True)
    
    source = Column(String(100), nullable=True) # e.g. "LinkedIn", "Referral", "Career Site"
    
    profile = relationship("ATSCandidateProfile", back_populates="candidate", uselist=False, cascade="all, delete-orphan")
    applications = relationship("ATSApplication", back_populates="candidate", cascade="all, delete-orphan")

class ATSCandidateProfile(EnterpriseMixin, Base):
    """Deep profile often generated/parsed via AI."""
    __tablename__ = "ats_candidate_profiles"
    
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("ats_candidates.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    skills = Column(JSON, default=list) # ["React", "Python", "Leadership"]
    experience = Column(JSON, default=list) # Array of objects
    education = Column(JSON, default=list)
    
    ai_summary = Column(Text, nullable=True)
    embedding = Column(Vector(768), nullable=True) # Candidate vector for semantic search
    
    candidate = relationship("ATSCandidate", back_populates="profile")

class ATSResume(EnterpriseMixin, Base):
    __tablename__ = "ats_resumes"
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("ats_candidates.id", ondelete="CASCADE"), nullable=False)
    media_asset_id = Column(UUID(as_uuid=True), nullable=False) # References global DAM MediaAsset table
    
    is_primary = Column(Boolean, default=True)
    parsed_data = Column(JSON, nullable=True)

class ATSApplication(EnterpriseMixin, Base):
    __tablename__ = "ats_applications"
    
    job_id = Column(UUID(as_uuid=True), ForeignKey("ats_jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("ats_candidates.id", ondelete="CASCADE"), nullable=False)
    
    stage_id = Column(UUID(as_uuid=True), ForeignKey("ats_pipeline_stages.id", ondelete="RESTRICT"), nullable=False)
    
    # The actual form submission answers matching `ATSJob.application_form_schema`
    form_data = Column(JSON, default=dict)
    
    ai_match_score = Column(Float, nullable=True) # 0.0 to 1.0 (0-100%)
    
    is_rejected = Column(Boolean, default=False)
    
    job = relationship("ATSJob", back_populates="applications")
    candidate = relationship("ATSCandidate", back_populates="applications")

class ATSApplicationEvent(EnterpriseMixin, Base):
    __tablename__ = "ats_application_events"
    application_id = Column(UUID(as_uuid=True), ForeignKey("ats_applications.id", ondelete="CASCADE"), nullable=False)
    
    event_type = Column(String(100), nullable=False) # e.g. "stage_change", "note_added", "email_sent"
    details = Column(JSON, default=dict)
    
# --- Operations ---

class ATSInterview(EnterpriseMixin, Base):
    __tablename__ = "ats_interviews"
    application_id = Column(UUID(as_uuid=True), ForeignKey("ats_applications.id", ondelete="CASCADE"), nullable=False)
    
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=60)
    interview_type = Column(String(50), default="video") # video, onsite, phone
    meeting_link = Column(String(500), nullable=True)

class ATSInterviewFeedback(EnterpriseMixin, Base):
    __tablename__ = "ats_interview_feedback"
    interview_id = Column(UUID(as_uuid=True), ForeignKey("ats_interviews.id", ondelete="CASCADE"), nullable=False)
    interviewer_id = Column(UUID(as_uuid=True), nullable=False) # references users.id
    
    score = Column(Integer, nullable=True) # 1-5
    notes = Column(Text, nullable=False)

class ATSAssessment(EnterpriseMixin, Base):
    __tablename__ = "ats_assessments"
    application_id = Column(UUID(as_uuid=True), ForeignKey("ats_applications.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    score = Column(Float, nullable=True)
    ai_evaluation = Column(Text, nullable=True)

class ATSOffer(EnterpriseMixin, Base):
    __tablename__ = "ats_offers"
    application_id = Column(UUID(as_uuid=True), ForeignKey("ats_applications.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(String(50), default="draft") # draft, pending_approval, sent, accepted, declined
    compensation_details = Column(JSON, nullable=False)
    document_id = Column(UUID(as_uuid=True), nullable=True) # references MediaAsset

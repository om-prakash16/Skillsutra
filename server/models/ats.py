import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    title = Column(String, nullable=False)
    description_markdown = Column(Text, nullable=True)
    description_html = Column(Text, nullable=True)
    
    # DRAFT, OPEN, CLOSED, ARCHIVED
    status = Column(String, default="DRAFT", nullable=False)
    
    # JSONB structures for complex nested data
    requirements = Column(JSONB, default=dict) # skills, experience_level, education
    logistics = Column(JSONB, default=dict) # salary_range, location, remote_policy
    
    ai_optimization_score = Column(Float, nullable=True)
    
    embedding = Column(Vector(768), nullable=True) # Semantic representation of job description and requirements
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    company = relationship("Company")
    creator = relationship("User")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    stages = relationship("JobAtsStage", back_populates="job", cascade="all, delete-orphan", order_by="JobAtsStage.order_index", lazy="selectin")

    __table_args__ = (
        Index('ix_jobs_embedding_hnsw', 'embedding', postgresql_using='hnsw', postgresql_with={'m': 16, 'ef_construction': 64}, postgresql_ops={'embedding': 'vector_cosine_ops'}),
    )


class JobAtsStage(Base):
    __tablename__ = "job_ats_stages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False)
    name = Column(String, nullable=False) # 'APPLIED', 'TECHNICAL_SCREEN', 'CULTURE_FIT'
    order_index = Column(Float, nullable=False, default=0.0) # Using float for easy drag-and-drop reordering
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="stages")
    applications = relationship("Application", back_populates="current_stage")

class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    current_stage_id = Column(UUID(as_uuid=True), ForeignKey('job_ats_stages.id', ondelete='SET NULL'), nullable=True)
    
    # ACTIVE, REJECTED, WITHDRAWN, HIRED
    status = Column(String, default="ACTIVE", nullable=False)
    
    # AI and ATS scoring
    ai_match_score = Column(Float, nullable=True)
    ats_score = Column(Float, nullable=True)
    
    # Applicant provided data
    applicant_metadata = Column(JSONB, default=dict) # Availability, notice period, salary expectations, resume_url
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="applications")
    candidate = relationship("User")
    current_stage = relationship("JobAtsStage", back_populates="applications")
    notes = relationship("ApplicationNote", back_populates="application", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")
    history = relationship("ApplicationHistory", back_populates="application", cascade="all, delete-orphan")

class ApplicationHistory(Base):
    __tablename__ = "application_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey('applications.id', ondelete='CASCADE'), nullable=False)
    
    # State change recorded
    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    
    # The user/recruiter who triggered the change
    changed_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    application = relationship("Application", back_populates="history")
    changed_by = relationship("User")


class ApplicationNote(Base):
    __tablename__ = "application_notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey('applications.id', ondelete='CASCADE'), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    content = Column(Text, nullable=False)
    # PRIVATE, TEAM
    visibility = Column(String, default="TEAM")
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    application = relationship("Application", back_populates="notes")
    author = relationship("User")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey('applications.id', ondelete='CASCADE'), nullable=False)
    
    # List of user IDs conducting the interview
    interviewer_ids = Column(ARRAY(UUID(as_uuid=True)), default=list)
    
    # SCHEDULED, COMPLETED, CANCELLED
    status = Column(String, default="SCHEDULED")
    
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    meeting_link = Column(String, nullable=True)
    
    feedback_scorecard = Column(JSONB, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    application = relationship("Application", back_populates="interviews")


class RecruiterActivityLog(Base):
    __tablename__ = "recruiter_activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    recruiter_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    # VIEW_RESUME, SHORTLIST, SCHEDULE_INTERVIEW, REJECT, ADD_NOTE, etc.
    action = Column(String, nullable=False)
    details = Column(JSONB, default=dict)
    
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    company = relationship("Company")
    recruiter = relationship("User", foreign_keys=[recruiter_id])
    candidate = relationship("User", foreign_keys=[candidate_id])

class AtsAuditLog(Base):
    __tablename__ = "ats_audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey('applications.id', ondelete='CASCADE'), nullable=False)
    actor_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True) # Recruiter who made the change
    
    action = Column(String, nullable=False) # 'MOVED_STAGE', 'REJECTED'
    previous_state = Column(JSONB, default=dict)
    new_state = Column(JSONB, default=dict)
    
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    application = relationship("Application")
    actor = relationship("User")

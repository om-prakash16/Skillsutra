import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    industry_category = Column(String, nullable=True) # e.g., 'Software Development', 'AI/ML'
    
    # Array of SkillTaxonomy UUIDs that this course teaches
    skills_taught = Column(ARRAY(UUID(as_uuid=True)), default=list)
    
    # URL to the video, external LMS, or internal content
    content_url = Column(String, nullable=True)
    duration_minutes = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user_progress = relationship("UserProgress", back_populates="course", cascade="all, delete-orphan")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    
    status = Column(String, default="ENROLLED") # ENROLLED, IN_PROGRESS, COMPLETED
    completion_percentage = Column(Float, default=0.0)
    
    last_accessed_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    course = relationship("Course", back_populates="user_progress")
    user = relationship("User")

class CompanyLearningTrack(Base):
    """A sponsored curriculum built by a company."""
    __tablename__ = "company_learning_tracks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Ordered array of Course UUIDs
    required_courses = Column(ARRAY(UUID(as_uuid=True)), default=list)
    
    # Badge awarded upon completion
    reward_badge_id = Column(UUID(as_uuid=True), ForeignKey('achievement_badges.id', ondelete='SET NULL'), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

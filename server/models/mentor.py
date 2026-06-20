import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from core.database import Base

class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    headline = Column(String, nullable=True)
    current_company = Column(String, nullable=True)
    current_role = Column(String, nullable=True)
    years_of_experience = Column(Integer, default=0)
    industry = Column(String, nullable=True)
    
    bio = Column(Text, nullable=True)
    languages = Column(ARRAY(String), default=list)
    timezone = Column(String, nullable=True)
    
    # Financials / Booking
    hourly_rate = Column(Float, default=0.0)
    is_accepting_mentees = Column(Boolean, default=True)
    
    # Pre-calculated reputation
    average_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    followers_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User")
    services = relationship("MentorService", back_populates="mentor", cascade="all, delete-orphan")
    sessions = relationship("MentorSession", back_populates="mentor", foreign_keys="[MentorSession.mentor_id]")

class MentorService(Base):
    __tablename__ = "mentor_services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mentor_id = Column(UUID(as_uuid=True), ForeignKey('mentor_profiles.id', ondelete='CASCADE'), nullable=False)
    
    # e.g., "Resume Review", "Mock Interview", "Career Guidance"
    service_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    price_usd = Column(Float, default=0.0)
    duration_minutes = Column(Integer, default=30)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    mentor = relationship("MentorProfile", back_populates="services")

class MentorSession(Base):
    __tablename__ = "mentor_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mentor_id = Column(UUID(as_uuid=True), ForeignKey('mentor_profiles.id', ondelete='CASCADE'), nullable=False)
    mentee_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    service_id = Column(UUID(as_uuid=True), ForeignKey('mentor_services.id', ondelete='SET NULL'), nullable=True)
    
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=30)
    
    # PENDING, SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
    status = Column(String, default="PENDING")
    
    meeting_link = Column(String, nullable=True)
    mentee_notes = Column(Text, nullable=True)
    
    amount_paid = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    mentor = relationship("MentorProfile", foreign_keys=[mentor_id], back_populates="sessions")
    mentee = relationship("User", foreign_keys=[mentee_id])
    service = relationship("MentorService")
    review = relationship("SessionReview", back_populates="session", uselist=False)

class SessionReview(Base):
    __tablename__ = "session_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey('mentor_sessions.id', ondelete='CASCADE'), unique=True, nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    rating = Column(Integer, nullable=False) # 1 to 5
    feedback = Column(Text, nullable=True)
    is_public = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    session = relationship("MentorSession", back_populates="review")
    reviewer = relationship("User")

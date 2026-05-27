import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # MOCK_INTERVIEW, CODING_TEST, HR_TEST, APTITUDE
    type = Column(String, nullable=False)
    
    # External reference or generic title
    title = Column(String, nullable=True) 
    
    # Store LLM JSON output here (strengths, weaknesses, suggestions)
    ai_feedback = Column(JSONB, default=dict)
    
    # Store actual transcript / code submitted
    submission_data = Column(JSONB, default=dict)
    
    score = Column(Float, nullable=True)
    status = Column(String, default="PENDING") # PENDING, IN_PROGRESS, COMPLETED, FAILED
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User")

class Badge(Base):
    __tablename__ = "badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String, nullable=True)
    
    # SKILL_VERIFIED, COURSE_COMPLETED, HACKATHON_WINNER
    badge_type = Column(String, nullable=False)
    
    issued_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    user = relationship("User")

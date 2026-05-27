import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from core.database import Base

class TalentPool(Base):
    __tablename__ = "talent_pools"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    members = relationship("TalentPoolMember", back_populates="pool", cascade="all, delete-orphan")


class TalentPoolMember(Base):
    __tablename__ = "talent_pool_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pool_id = Column(UUID(as_uuid=True), ForeignKey('talent_pools.id', ondelete='CASCADE'), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    added_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    status = Column(String, default="NURTURING") # NURTURING, READY, COLD, CONTACTED
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    pool = relationship("TalentPool", back_populates="members")
    candidate = relationship("User", foreign_keys=[candidate_id])
    added_by = relationship("User", foreign_keys=[added_by_id])


class EmployerBrand(Base):
    __tablename__ = "employer_brands"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    culture_description = Column(Text, nullable=True)
    tech_stack = Column(ARRAY(String), default=list)
    
    # Store URLs for videos, images, company blogs
    media_gallery = Column(JSONB, default=list) 
    
    # Custom branding colors, fonts
    branding_config = Column(JSONB, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)


class EmployeeRecord(Base):
    __tablename__ = "employee_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    department = Column(String, nullable=True)
    current_role = Column(String, nullable=True)
    performance_score = Column(Float, nullable=True)
    
    # Flag to indicate if employee is open to internal mobility
    open_to_mobility = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)


class CompanyAssessment(Base):
    __tablename__ = "company_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    type = Column(String, nullable=False) # CODING, SYSTEM_DESIGN, MCQ, APTITUDE
    
    # Stores configuration such as time limits, anti-cheat flags, plagiarism detection strictness
    config = Column(JSONB, default=dict)
    
    # Actual questions or challenges payload
    content = Column(JSONB, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

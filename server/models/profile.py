import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Enum, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from core.database import Base
import enum

class VisibilityMode(str, enum.Enum):
    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE"
    RECRUITER_ONLY = "RECRUITER_ONLY"

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    headline = Column(String, nullable=True)
    about = Column(Text, nullable=True)
    resume_url = Column(String, nullable=True)
    banner_url = Column(String, nullable=True)
    
    visibility_mode = Column(String, default=VisibilityMode.PUBLIC.value)
    open_to_work = Column(Boolean, default=False)
    
    # Social links
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    embedding = Column(Vector(768), nullable=True) # Semantic profile representation
    
    user = relationship("User", backref="profile")
    experiences = relationship("Experience", back_populates="profile", cascade="all, delete-orphan", lazy="selectin")
    educations = relationship("Education", back_populates="profile", cascade="all, delete-orphan", lazy="selectin")
    projects = relationship("Project", back_populates="profile", cascade="all, delete-orphan", lazy="selectin")

    __table_args__ = (
        Index('ix_profiles_embedding_hnsw', 'embedding', postgresql_using='hnsw', postgresql_with={'m': 16, 'ef_construction': 64}, postgresql_ops={'embedding': 'vector_cosine_ops'}),
    )

class Experience(Base):
    __tablename__ = "experiences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    company_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, nullable=True)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    
    profile = relationship("Profile", back_populates="experiences")

class Education(Base):
    __tablename__ = "educations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    school = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    field_of_study = Column(String, nullable=True)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    
    profile = relationship("Profile", back_populates="educations")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    skills_used = Column(JSONB, default=list)
    
    # Portfolio enhancements
    is_portfolio_item = Column(Boolean, default=False)
    embedded_media = Column(JSONB, default=list) # List of image URLs, video URLs
    
    profile = relationship("Profile", back_populates="projects")

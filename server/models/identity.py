from sqlalchemy import Column, String, Boolean, JSON, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from core.database import Base

class UserIdentity(Base):
    __tablename__ = "user_identities"

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    username = Column(String(30), unique=True, nullable=False, index=True)
    is_verified = Column(Boolean, default=False)
    profile_strength_score = Column(Integer, default=0) # Computed by AI
    created_at = Column(DateTime, default=datetime.utcnow)

class UsernameHistory(Base):
    __tablename__ = "username_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    old_username = Column(String(30), nullable=False)
    changed_at = Column(DateTime, default=datetime.utcnow)

class VisibilitySettings(Base):
    __tablename__ = "visibility_settings"

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    profile_visibility = Column(String(20), default='PUBLIC') # PUBLIC, PRIVATE, RECRUITER_ONLY
    resume_visibility = Column(String(20), default='RECRUITER_ONLY')
    portfolio_visibility = Column(String(20), default='PUBLIC')
    social_visibility = Column(String(20), default='PUBLIC')

class PublicProfile(Base):
    __tablename__ = "public_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    headline = Column(String(255), nullable=True)
    bio = Column(String, nullable=True)
    
    # Store aggregated/denormalized data for ultra-fast rendering
    skills = Column(JSONB, default=list)
    experience = Column(JSONB, default=list)
    education = Column(JSONB, default=list)
    social_links = Column(JSONB, default=dict)
    theme_preferences = Column(JSONB, default=dict)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    github_repo_url = Column(String, nullable=True)
    live_demo_url = Column(String, nullable=True)
    architecture_writeup = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ProfileView(Base):
    __tablename__ = "profile_views"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False) # The profile being viewed
    viewer_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True) # Who viewed it (if logged in)
    viewer_type = Column(String(20), nullable=False) # ANONYMOUS, USER, RECRUITER
    viewed_at = Column(DateTime, default=datetime.utcnow)
    ip_hash = Column(String, nullable=True) # Hashed IP to prevent spam counting

from models.mixins import EnterpriseMixin

class VerificationRequest(EnterpriseMixin, Base):
    """
    Enterprise Verification Requests for Identity & Access.
    """
    __tablename__ = "verification_requests"

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    verification_type = Column(String, nullable=False) # Email, Phone, Government ID, Company, University
    status = Column(String, default="pending") # pending, approved, rejected, expired, request_changes
    
    document_url = Column(String, nullable=True)
    metadata_json = Column(JSONB, nullable=True)
    
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(String, nullable=True)


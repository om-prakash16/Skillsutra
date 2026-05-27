import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    target_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    action = Column(String, nullable=False) # e.g. USER_BANNED, CMS_PUBLISHED, ROLE_CHANGED
    entity_type = Column(String, nullable=False) # e.g. USER, COMPANY, JOB, CMS_PAGE
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    
    old_values = Column(JSONB, default=dict)
    new_values = Column(JSONB, default=dict)
    
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    actor = relationship("User", foreign_keys=[actor_id])
    target_user = relationship("User", foreign_keys=[target_user_id])


class CMSPage(Base):
    __tablename__ = "cms_pages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    meta_description = Column(Text, nullable=True)
    
    # DRAFT, PUBLISHED, ARCHIVED
    status = Column(String, default="DRAFT", nullable=False)
    
    published_at = Column(DateTime(timezone=True), nullable=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    blocks = relationship("CMSBlock", back_populates="page", cascade="all, delete-orphan", order_by="CMSBlock.sort_order")
    author = relationship("User")


class CMSBlock(Base):
    __tablename__ = "cms_blocks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id = Column(UUID(as_uuid=True), ForeignKey('cms_pages.id', ondelete='CASCADE'), nullable=False)
    
    # HERO, FEATURE_GRID, TESTIMONIAL, RICH_TEXT, BANNER
    block_type = Column(String, nullable=False)
    
    # The actual content payload
    content = Column(JSONB, default=dict)
    
    sort_order = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    page = relationship("CMSPage", back_populates="blocks")


class ModerationReport(Base):
    __tablename__ = "moderation_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    target_entity_id = Column(UUID(as_uuid=True), nullable=False)
    target_entity_type = Column(String, nullable=False) # USER, JOB, COMPANY, COMMENT
    
    reason = Column(Text, nullable=False)
    
    # PENDING, RESOLVED, DISMISSED
    status = Column(String, default="PENDING", nullable=False)
    
    # AI Toxicity/Spam score pre-computed
    ai_confidence_score = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reporter = relationship("User")


class FeatureFlag(Base):
    __tablename__ = "feature_flags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    
    is_enabled = Column(Boolean, default=False)
    rollout_percentage = Column(Integer, default=100) # 0 to 100
    
    targeting_rules = Column(JSONB, default=dict) # e.g. {"user_roles": ["SUPER_ADMIN"]}
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

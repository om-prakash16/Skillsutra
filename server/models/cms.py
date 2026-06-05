import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base
import enum

class ContentStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class CMSPage(Base):
    __tablename__ = "cms_pages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    status = Column(String, default=ContentStatus.DRAFT.value)
    
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    
    content_blocks = Column(JSONB, default=list)  # Reusable page blocks
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class CMSArticle(Base):
    __tablename__ = "cms_articles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    status = Column(String, default=ContentStatus.DRAFT.value)
    
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    featured_image_url = Column(String, nullable=True)
    
    author_id = Column(UUID(as_uuid=True), nullable=True) # References users.id loosely
    
    tags = Column(JSONB, default=list)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class CMSBanner(Base):
    __tablename__ = "cms_banners"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    status = Column(String, default="INACTIVE") # ACTIVE, INACTIVE, SCHEDULED
    
    content = Column(Text, nullable=False)
    link_url = Column(String, nullable=True)
    bg_color = Column(String, nullable=True)
    text_color = Column(String, nullable=True)
    
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

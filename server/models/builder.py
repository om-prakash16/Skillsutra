import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Site(Base):
    """
    Represents a multi-tenant website project.
    """
    __tablename__ = "builder_sites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True) # Soft reference to Tenant for row-level isolation
    name = Column(String, nullable=False)
    domain = Column(String, unique=True, nullable=True)
    custom_domain = Column(String, unique=True, nullable=True)
    
    # Global Site Settings (Themes, Colors, Typography)
    global_styles = Column(JSONB, default=dict)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    pages = relationship("BuilderPage", back_populates="site", cascade="all, delete-orphan")


class BuilderPage(Base):
    """
    Represents an individual page within a Site.
    """
    __tablename__ = "builder_pages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    site_id = Column(UUID(as_uuid=True), ForeignKey("builder_sites.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String, nullable=False)
    slug = Column(String, nullable=False)
    
    # SEO
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    og_image = Column(String, nullable=True)
    
    # Live Active Content Tree
    component_tree = Column(JSONB, default=list)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    site = relationship("Site", back_populates="pages")
    versions = relationship("BuilderPageVersion", back_populates="page", cascade="all, delete-orphan")


class BuilderPageVersion(Base):
    """
    Tracks the version history (Undo/Redo/Draft/Publish) of a BuilderPage.
    """
    __tablename__ = "builder_page_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id = Column(UUID(as_uuid=True), ForeignKey("builder_pages.id", ondelete="CASCADE"), nullable=False)
    
    version_name = Column(String, nullable=True) # e.g., "v1.0 - Holiday Sale"
    component_tree = Column(JSONB, default=list) # Snapshot of the tree at this version
    
    is_published = Column(Boolean, default=False)
    created_by_user_id = Column(UUID(as_uuid=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    page = relationship("BuilderPage", back_populates="versions")

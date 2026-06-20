import enum
from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .mixins import EnterpriseMixin
from core.database import Base

class ContentStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    REVIEW = "REVIEW"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class CMSCollection(EnterpriseMixin, Base):
    __tablename__ = "cms_collections"

    name = Column(String(255), nullable=False) # e.g. "Blog Posts"
    slug = Column(String(255), unique=True, nullable=False, index=True) # e.g. "blog-posts"
    description = Column(Text, nullable=True)
    is_singleton = Column(Boolean, default=False) # e.g. "Homepage Configuration"
    
    fields = relationship("CMSField", back_populates="collection", cascade="all, delete-orphan")
    entries = relationship("CMSEntry", back_populates="collection", cascade="all, delete-orphan")

class CMSField(EnterpriseMixin, Base):
    __tablename__ = "cms_fields"

    collection_id = Column(UUID(as_uuid=True), ForeignKey("cms_collections.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False) # e.g. "Featured Image"
    machine_name = Column(String(255), nullable=False) # e.g. "featured_image" (JSON key)
    field_type = Column(String(100), nullable=False) # string, text, richtext, boolean, json, relation
    
    # Validation / Options (required, min, max, default_value, relation_target)
    settings = Column(JSON, default=dict)
    
    is_required = Column(Boolean, default=False)
    is_unique = Column(Boolean, default=False)
    
    collection = relationship("CMSCollection", back_populates="fields")

class CMSEntry(EnterpriseMixin, Base):
    __tablename__ = "cms_entries"

    collection_id = Column(UUID(as_uuid=True), ForeignKey("cms_collections.id", ondelete="CASCADE"), nullable=False)
    
    # Built-in fields
    status = Column(String(50), default=ContentStatus.DRAFT.value)
    author_id = Column(UUID(as_uuid=True), nullable=True) # The user who created this entry
    
    # The actual dynamic content payload
    data = Column(JSONB, default=dict)
    
    collection = relationship("CMSCollection", back_populates="entries")
    versions = relationship("CMSEntryVersion", back_populates="entry", cascade="all, delete-orphan")

class CMSEntryVersion(EnterpriseMixin, Base):
    __tablename__ = "cms_entry_versions"

    entry_id = Column(UUID(as_uuid=True), ForeignKey("cms_entries.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(String(50), nullable=False)
    
    data = Column(JSONB, nullable=False)
    created_by_id = Column(UUID(as_uuid=True), nullable=True)
    
    entry = relationship("CMSEntry", back_populates="versions")

class CMSTemplate(EnterpriseMixin, Base):
    __tablename__ = "cms_templates"
    
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    # The Visual Builder tree configuration for this template
    layout_tree = Column(JSONB, default=list)

class CMSPage(EnterpriseMixin, Base):
    """
    While entries hold raw data, Pages are the actual routable entities.
    A page can be static (just visual blocks) or dynamic (bound to an entry).
    """
    __tablename__ = "cms_pages"

    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    status = Column(String(50), default=ContentStatus.DRAFT.value)
    
    # Visual Builder component tree specific to this page
    component_tree = Column(JSONB, default=list)
    
    # SEO
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    
    # Dynamic routing (e.g. if this page represents a generic "Blog Post Template")
    bound_collection_id = Column(UUID(as_uuid=True), ForeignKey("cms_collections.id"), nullable=True)

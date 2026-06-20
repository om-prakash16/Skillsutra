from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Integer, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .mixins import EnterpriseMixin
from database.core import Base

class MediaFolder(EnterpriseMixin, Base):
    __tablename__ = "media_folders"
    
    name = Column(String(255), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("media_folders.id"), nullable=True)
    
    # Self-referential relationship for nested folders
    children = relationship("MediaFolder", backref="parent", remote_side="MediaFolder.id")
    assets = relationship("MediaAsset", back_populates="folder")

class MediaAsset(EnterpriseMixin, Base):
    __tablename__ = "media_assets"
    
    name = Column(String(255), nullable=False)
    alt_text = Column(String(500), nullable=True)
    description = Column(String(1000), nullable=True)
    
    file_name = Column(String(500), nullable=False)
    mime_type = Column(String(100), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    
    url = Column(String(1000), nullable=False)
    provider = Column(String(50), default="local") # local, s3, gcs
    
    folder_id = Column(UUID(as_uuid=True), ForeignKey("media_folders.id"), nullable=True)
    
    # E.g. dimensions, duration, EXIF data
    metadata_json = Column(JSON, default=dict)
    
    folder = relationship("MediaFolder", back_populates="assets")
    tags = relationship("MediaTag", secondary="media_asset_tags")

class MediaTag(EnterpriseMixin, Base):
    __tablename__ = "media_tags"
    
    name = Column(String(100), nullable=False, unique=True)
    
class MediaAssetTag(Base):
    __tablename__ = "media_asset_tags"
    
    asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("media_tags.id", ondelete="CASCADE"), primary_key=True)

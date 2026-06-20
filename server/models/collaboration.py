from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Integer, JSON, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from .mixins import EnterpriseMixin
from database.core import Base

class CommentThread(EnterpriseMixin, Base):
    __tablename__ = "comment_threads"
    
    # Polymorphic attachment to any entity in the system
    entity_type = Column(String(100), nullable=False) # e.g. "cms_entry", "media_asset", "workflow"
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    is_resolved = Column(Boolean, default=False)
    
    comments = relationship("CollabComment", back_populates="thread", cascade="all, delete-orphan")

class CollabComment(EnterpriseMixin, Base):
    __tablename__ = "collaboration_comments"
    
    thread_id = Column(UUID(as_uuid=True), ForeignKey("comment_threads.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(UUID(as_uuid=True), nullable=False) # references users.id
    
    content = Column(Text, nullable=False)
    
    # For nested replies
    parent_id = Column(UUID(as_uuid=True), ForeignKey("collaboration_comments.id", ondelete="CASCADE"), nullable=True)
    
    is_pinned = Column(Boolean, default=False)
    reactions = Column(JSON, default=dict) # e.g. {"thumbs_up": ["user_id_1"], "heart": []}
    
    thread = relationship("CommentThread", back_populates="comments")
    replies = relationship("CollabComment", backref="parent", remote_side="CollabComment.id")

class Favorite(EnterpriseMixin, Base):
    """Universal favorites system for users to bookmark anything."""
    __tablename__ = "favorites"
    
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    
    collection_name = Column(String(100), default="Default") # e.g. "To Read", "Starred"

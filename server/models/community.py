import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class ForumTopic(Base):
    __tablename__ = "forum_topics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    posts = relationship("ForumPost", back_populates="topic", cascade="all, delete-orphan")


class ForumPost(Base):
    __tablename__ = "forum_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id = Column(UUID(as_uuid=True), ForeignKey('forum_topics.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    views = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    topic = relationship("ForumTopic", back_populates="posts")
    user = relationship("User")
    comments = relationship("ForumComment", back_populates="post", cascade="all, delete-orphan")


class ForumComment(Base):
    __tablename__ = "forum_comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey('forum_posts.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    content = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    post = relationship("ForumPost", back_populates="comments")
    user = relationship("User")


class MentorBooking(Base):
    __tablename__ = "mentor_bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mentor_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    mentee_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # REQUESTED, SCHEDULED, COMPLETED, CANCELLED
    status = Column(String, default="REQUESTED")
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    meeting_link = Column(String, nullable=True)
    
    topic = Column(String, nullable=True) # e.g., 'Resume Review', 'Mock Interview'
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    mentor = relationship("User", foreign_keys=[mentor_id])
    mentee = relationship("User", foreign_keys=[mentee_id])


class SavedItem(Base):
    __tablename__ = "saved_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    item_type = Column(String, nullable=False) # JOB, COURSE, POST
    item_id = Column(UUID(as_uuid=True), nullable=False) # ID of the target resource
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    user = relationship("User")

class CommunityGroup(Base):
    __tablename__ = "community_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    industry = Column(String, nullable=True)
    
    is_company_sponsored = Column(Boolean, default=False)
    sponsor_company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='SET NULL'), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class IndustryEvent(Base):
    __tablename__ = "industry_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    host_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    is_virtual = Column(Boolean, default=True)
    location_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    host = relationship("User")

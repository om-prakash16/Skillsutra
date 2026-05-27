import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, Integer, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base
import enum

class ConnectionStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"

# ==============================================================================
# CONNECTION GRAPH
# ==============================================================================

class Connection(Base):
    __tablename__ = "connections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    status = Column(String, default=ConnectionStatus.PENDING.value)
    note = Column(Text, nullable=True) # Optional note when sending request
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('sender_id', 'receiver_id', name='uq_connection_edge'),
        Index('idx_connection_sender_receiver', 'sender_id', 'receiver_id')
    )
    
    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

class Follow(Base):
    __tablename__ = "follows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    follower_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    followed_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('follower_id', 'followed_id', name='uq_follow_edge'),
        Index('idx_follow_follower_followed', 'follower_id', 'followed_id')
    )


# ==============================================================================
# SOCIAL FEED & POSTS
# ==============================================================================

class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    content_markdown = Column(Text, nullable=False)
    
    # PUBLIC, CONNECTIONS_ONLY, PRIVATE
    visibility = Column(String, default="PUBLIC")
    
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    reposts_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    author = relationship("User")
    media = relationship("PostMedia", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

class PostMedia(Base):
    __tablename__ = "post_media"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    
    media_url = Column(String, nullable=False)
    media_type = Column(String, nullable=False) # IMAGE, VIDEO, DOCUMENT
    
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    post = relationship("Post", back_populates="media")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    parent_comment_id = Column(UUID(as_uuid=True), ForeignKey('comments.id', ondelete='CASCADE'), nullable=True)
    
    content = Column(Text, nullable=False)
    likes_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    post = relationship("Post", back_populates="comments")
    author = relationship("User")
    replies = relationship("Comment", back_populates="parent")
    parent = relationship("Comment", remote_side=[id], back_populates="replies")


class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'), nullable=True)
    comment_id = Column(UUID(as_uuid=True), ForeignKey('comments.id', ondelete='CASCADE'), nullable=True)
    
    reaction_type = Column(String, default="LIKE") # LIKE, CELEBRATE, SUPPORT, INSIGHTFUL
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='uq_reaction_post'),
        UniqueConstraint('user_id', 'comment_id', name='uq_reaction_comment')
    )

# ==============================================================================
# MESSAGING & CHAT
# ==============================================================================

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, default="DIRECT") # DIRECT, GROUP
    title = Column(String, nullable=True) # Used for Group chats
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    participants = relationship("ConversationParticipant", back_populates="conversation", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('conversations.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    last_read_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    joined_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="participants")
    user = relationship("User")

    __table_args__ = (
        UniqueConstraint('conversation_id', 'user_id', name='uq_conversation_participant'),
    )

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('conversations.id', ondelete='CASCADE'), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id])

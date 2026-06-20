import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from core.database import Base

class Conversation(Base):
    """A chat thread between two or more participants."""
    __tablename__ = "messaging_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # DIRECT_MESSAGE, GROUP_CHAT, AI_COPILOT
    conversation_type = Column(String, default="DIRECT_MESSAGE", nullable=False)
    
    # Array of participant User IDs
    participant_ids = Column(ARRAY(UUID(as_uuid=True)), default=list, index=True)
    
    # Optional metadata (e.g., linked to a specific Job or Mentorship session)
    context_metadata = Column(JSONB, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")


class Message(Base):
    """An individual message in a conversation."""
    __tablename__ = "messaging_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('messaging_conversations.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Who sent it (Could be a User, or null if it's a SYSTEM or AI message)
    sender_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    
    content = Column(Text, nullable=False)
    
    # Rich content attachments (images, code snippets, video meeting links)
    attachments = Column(JSONB, default=list)
    
    # Read receipts
    read_by_ids = Column(ARRAY(UUID(as_uuid=True)), default=list)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")

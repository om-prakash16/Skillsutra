import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='SET NULL'), nullable=True)
    assigned_admin_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    # Low, Medium, High, Critical
    priority = Column(String, default="Medium")
    
    # Open, Assigned, In Progress, Resolved, Closed
    status = Column(String, default="Open")
    
    # Store threaded replies directly as a JSON array for MVP simplicity
    # Schema: [{ "author_id": "...", "author_role": "...", "content": "...", "timestamp": "..." }]
    replies = Column(JSONB, default=list)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    company = relationship("Company")
    assigned_admin = relationship("User", foreign_keys=[assigned_admin_id])


class AIUsageLog(Base):
    __tablename__ = "ai_usage_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='SET NULL'), nullable=True)
    
    # e.g., "resume_analysis", "candidate_matching", "job_description_generator"
    feature_used = Column(String, nullable=False)
    
    model_version = Column(String, nullable=False) # e.g., "gpt-4-turbo", "gemini-1.5-pro"
    
    tokens_prompt = Column(Integer, default=0)
    tokens_completion = Column(Integer, default=0)
    tokens_total = Column(Integer, default=0)
    
    cost_usd = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    user = relationship("User")
    company = relationship("Company")

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Secret(Base):
    __tablename__ = "secrets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True, index=True) # e.g. STRIPE_API_KEY
    description = Column(String, nullable=True)
    encrypted_value = Column(Text, nullable=False) # The encrypted secret
    
    # Metadata
    category = Column(String, default="GENERAL") # e.g. PAYMENT, EMAIL, AI
    environment = Column(String, default="PRODUCTION") # PRODUCTION, STAGING, DEVELOPMENT
    
    is_active = Column(Boolean, default=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    last_accessed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Track who created it
    creator = relationship("User", foreign_keys=[created_by])

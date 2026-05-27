import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Float, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base
import enum

class NodeStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"

class SkillTaxonomy(Base):
    """Global taxonomy of all platform skills."""
    __tablename__ = "skill_taxonomy"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=True) # e.g., 'frontend', 'backend', 'soft_skill'
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user_nodes = relationship("UserSkillNode", back_populates="skill")

class UserSkillNode(Base):
    """A user's specific progression in a given skill."""
    __tablename__ = "user_skill_nodes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skill_taxonomy.id", ondelete="CASCADE"), nullable=False)
    
    proof_score = Column(Float, default=0.0) # Reputation/Validation score
    experience_level = Column(String, default="BEGINNER")
    status = Column(String, default=NodeStatus.ACTIVE.value)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    skill = relationship("SkillTaxonomy", back_populates="user_nodes")
    # user relationship would go here

class ProjectLedger(Base):
    """Cryptographic-style ledger of project contributions mapping to skills."""
    __tablename__ = "project_ledger"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    project_hash = Column(String, unique=True, nullable=True) # On-chain or unique hash
    project_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    skills_validated = Column(JSONB, default=list) # List of skill taxonomy IDs
    validation_status = Column(String, default="PENDING")
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

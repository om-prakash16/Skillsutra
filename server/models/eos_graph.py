import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class DigitalTwin(Base):
    """
    The Career Digital Twin.
    A unified professional identity graph mapping a user to all their dimensions.
    """
    __tablename__ = "eos_digital_twins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    # Graph References stored as JSON arrays for high-speed retrieval
    skills_graph = Column(JSONB, default=[]) # e.g. [{"skill": "Python", "verified_by": "HackerRank"}]
    network_graph = Column(JSONB, default=[]) # e.g. [{"connection_id": "uuid", "strength": 0.8}]
    learning_graph = Column(JSONB, default=[]) # e.g. [{"course_id": "uuid", "completion": 100}]
    
    # AI Predictions
    predicted_next_role = Column(String, nullable=True)
    churn_risk_score = Column(Float, default=0.0)
    
    last_synced_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class ReputationScore(Base):
    """
    The Reputation Engine.
    Quantifies trust and skill across the entire ecosystem.
    """
    __tablename__ = "eos_reputation_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    # 0 to 100 scale
    trust_score = Column(Float, default=50.0) # Increases with verified ID, decreases with spam
    skill_score = Column(Float, default=0.0) # Increases with assessments and projects
    community_score = Column(Float, default=0.0) # Increases with upvotes and mentorship
    
    # Tier System
    tier_badge = Column(String, default="BRONZE") # BRONZE, SILVER, GOLD, PLATINUM
    
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

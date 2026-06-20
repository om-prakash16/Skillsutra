import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class HealthScore(Base):
    """
    Customer Success Engine.
    Predicts churn by monitoring platform engagement (e.g. ATS usage, profile completion).
    """
    __tablename__ = "health_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    
    score = Column(Float, default=100.0) # 0 to 100. < 40 indicates high churn risk
    category = Column(String, default="HEALTHY") # HEALTHY, AT_RISK, CRITICAL
    
    # Factors reducing or increasing the score
    login_frequency_factor = Column(Float, default=1.0)
    usage_factor = Column(Float, default=1.0) # e.g. How many jobs posted or applications sent
    
    last_calculated_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class ABTestExperiment(Base):
    """
    Growth & Experimentation Platform.
    Allows A/B testing of pricing models, feature rollouts, and landing pages.
    """
    __tablename__ = "ab_test_experiments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    experiment_name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    
    status = Column(String, default="DRAFT") # DRAFT, RUNNING, CONCLUDED
    
    # E.g. variant_a = {"button_color": "blue"}, variant_b = {"button_color": "red"}
    variants = Column(JSONB, nullable=False) 
    
    # Results
    traffic_allocation = Column(Integer, default=50) # Percentage of traffic assigned to Variant B
    winning_variant = Column(String, nullable=True)
    
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)

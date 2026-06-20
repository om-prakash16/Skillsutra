import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class AnalyticsEvent(Base):
    """
    Atomic unit of tracking.
    Stores raw events for funnel and cohort analysis.
    """
    __tablename__ = "analytics_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String, nullable=False) # e.g. USER_SIGNUP, JOB_VIEWED, OFFER_ACCEPTED
    
    actor_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    entity_id = Column(String, nullable=True) # ID of the job, company, etc.
    
    properties = Column(JSONB, default=dict) # e.g. {"browser": "Chrome", "source": "LinkedIn"}
    
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)

class KPIMetric(Base):
    """
    Pre-aggregated metrics for lightning-fast dashboards.
    """
    __tablename__ = "kpi_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_name = Column(String, nullable=False) # e.g. MRR, TOTAL_USERS, DAU
    
    dimension = Column(String, nullable=True) # e.g. "COMPANY_ID:123" for scoped metrics
    
    date_bucket = Column(DateTime(timezone=True), nullable=False) # e.g. 2026-06-11 00:00:00
    value = Column(Float, default=0.0)
    
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

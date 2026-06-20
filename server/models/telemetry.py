import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer, Index
from sqlalchemy.dialects.postgresql import UUID
from core.database import Base

class SystemMetric(Base):
    """
    Time-series data for infrastructure health.
    NOTE: In production, consider pg_partman for this table.
    """
    __tablename__ = "telemetry_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    service_name = Column(String, nullable=False) # e.g. "api-gateway", "worker-queue"
    metric_type = Column(String, nullable=False) # "cpu_percent", "memory_bytes", "p99_latency"
    value = Column(Float, nullable=False)
    
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

# Add an index to speed up time-series graphing queries
Index("ix_system_metrics_timestamp_type", SystemMetric.timestamp, SystemMetric.metric_type)

class APIUsage(Base):
    """
    Tracks API calls per API Key for rate limiting and usage-based billing.
    """
    __tablename__ = "api_usage"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    api_key_id = Column(UUID(as_uuid=True), ForeignKey('api_keys.id', ondelete='CASCADE'), nullable=False)
    
    endpoint = Column(String, nullable=False)
    status_code = Column(Integer, nullable=False) # Track how many 500s or 429s an API key hits
    
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

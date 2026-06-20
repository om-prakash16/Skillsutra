import uuid
from datetime import datetime
from sqlalchemy import Column, Float, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class SystemMetric(Base):
    __tablename__ = "system_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Can be "global", "web_node_1", "worker_queue", "database"
    service_name = Column(String, default="global")
    
    # Core hardware metrics
    cpu_usage_percent = Column(Float, default=0.0)
    ram_usage_mb = Column(Float, default=0.0)
    disk_usage_percent = Column(Float, default=0.0)
    
    # Application metrics
    active_workers = Column(Integer, default=0)
    queue_length = Column(Integer, default=0)
    error_rate_percent = Column(Float, default=0.0)
    requests_per_second = Column(Float, default=0.0)
    
    # Optional dump of arbitrary data for custom charts
    metadata_dump = Column(JSONB, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)

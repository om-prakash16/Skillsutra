from sqlalchemy import Column, String, Boolean, Integer, Float, ForeignKey, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base
from models.mixins import EnterpriseMixin

class SystemAlert(EnterpriseMixin, Base):
    __tablename__ = "system_alerts"
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # "info", "warning", "critical"
    severity = Column(String, default="info")
    
    # "open", "acknowledged", "resolved"
    status = Column(String, default="open")
    
    source = Column(String, nullable=False) # e.g., "celery_monitor", "database", "ai_provider"
    
    resolved_at = Column(DateTime(timezone=True), nullable=True)

class BackupJob(EnterpriseMixin, Base):
    __tablename__ = "backup_jobs"
    
    # "database", "media", "configuration"
    backup_type = Column(String, nullable=False)
    
    # "running", "completed", "failed"
    status = Column(String, default="running")
    
    storage_url = Column(String, nullable=True)
    size_bytes = Column(Integer, default=0)
    
    started_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)

class HealthCheckLog(EnterpriseMixin, Base):
    __tablename__ = "health_check_logs"
    
    service_name = Column(String, nullable=False) # "postgresql", "redis", "celery", "openai"
    
    # "healthy", "degraded", "down"
    status = Column(String, nullable=False)
    
    latency_ms = Column(Integer, default=0)
    details = Column(JSONB, default=dict)

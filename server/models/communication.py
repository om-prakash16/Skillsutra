import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # JOB, APPLICATION, INTERVIEW, MENTOR, SYSTEM, SECURITY, BILLING
    type = Column(String, nullable=False)
    priority = Column(String, default="NORMAL") # LOW, NORMAL, HIGH, CRITICAL
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    action_url = Column(String, nullable=True)
    
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    message = Column(Text, nullable=True)
    status = Column(String(50), default="unread")
    notification_metadata = Column("metadata", JSONB, default=dict)
    link = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (
        Index('idx_notification_user_created', 'user_id', 'created_at'),
    )

    user = relationship("User")

class NotificationPreference(Base):
    __tablename__ = "comm_notification_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    # Stores fine-grained settings like: {"email_jobs": "DAILY", "push_messages": "IMMEDIATE"}
    preferences = Column(JSONB, default=dict)
    
    # Global toggle
    do_not_disturb = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")

class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    recipient_email = Column(String, nullable=False)
    template_name = Column(String, nullable=False) # e.g., "WELCOME_EMAIL", "INTERVIEW_INVITE"
    subject = Column(String, nullable=True)
    
    # QUEUED, SENT, DELIVERED, BOUNCED, FAILED
    status = Column(String, default="QUEUED")
    error_message = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    sent_at = Column(DateTime(timezone=True), nullable=True)

class SystemAnnouncement(Base):
    __tablename__ = "system_announcements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_by_admin_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    title = Column(String, nullable=False)
    content_markdown = Column(Text, nullable=False)
    
    # PLATFORM_UPDATE, MAINTENANCE, SECURITY_ALERT
    category = Column(String, default="PLATFORM_UPDATE")
    target_audience = Column(String, default="ALL") # ALL, COMPANIES, CANDIDATES, MENTORS
    
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class EmailTemplate(Base):
    __tablename__ = "email_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False) # e.g., "WELCOME_EMAIL"
    description = Column(String, nullable=True)
    
    subject_template = Column(String, nullable=False)
    body_html_template = Column(Text, nullable=False)
    body_text_template = Column(Text, nullable=True)
    
    # JSON schema defining required variables (e.g. {"user_name": "string"})
    required_variables = Column(JSONB, default=dict)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class ActivityEvent(Base):
    """The core of the Activity Feed Engine"""
    __tablename__ = "activity_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=True)
    
    # E.g., "JOB_POSTED", "PROJECT_ADDED", "CONNECTION_CREATED"
    action_type = Column(String, nullable=False)
    
    target_entity_id = Column(String, nullable=True)
    target_entity_type = Column(String, nullable=True) # E.g., "JOB", "COMMUNITY"
    
    metadata_payload = Column(JSONB, default=dict) # E.g., {"job_title": "Senior Engineer"}
    
    # PUBLIC, CONNECTIONS_ONLY, COMPANY_ONLY, PRIVATE
    visibility = Column(String, default="PUBLIC")
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (
        Index('idx_activity_feed_actor_time', 'actor_id', 'created_at'),
        Index('idx_activity_feed_company_time', 'company_id', 'created_at'),
    )

    actor = relationship("User")

class UserMute(Base):
    """
    Tracks specific entities (users, companies, threads) the user has muted.
    """
    __tablename__ = "user_mutes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String(50), nullable=False)  # 'COMPANY', 'USER', 'COMMUNITY'
    target_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (
        Index('idx_user_mutes_lookup', 'user_id', 'target_type', 'target_id', unique=True),
    )

class PendingDigest(Base):
    """
    Stores batched notifications that are waiting to be sent in a daily/weekly digest email.
    """
    __tablename__ = "pending_digests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    notification_data = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

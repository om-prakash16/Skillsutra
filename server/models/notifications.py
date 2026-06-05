from sqlalchemy import Column, String, Boolean, JSON, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from core.database import Base

class NotificationPreference(Base):
    """
    Stores complex user preferences for smart notifications using JSONB.
    """
    __tablename__ = "notification_preferences"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    
    # {"email": true, "push": false, "in_app": true, "websocket": true}
    channels = Column(JSON, default=dict)
    
    # {"jobs": {"roles": ["backend"], "locations": ["remote"]}, "hackathons": true}
    categories = Column(JSON, default=dict)
    
    # {"start": "22:00", "end": "08:00", "timezone": "UTC"}
    quiet_hours = Column(JSON, default=dict)
    
    # 'IMMEDIATE', 'DAILY_DIGEST', 'WEEKLY_DIGEST'
    frequency = Column(String(50), default="IMMEDIATE")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserMute(Base):
    """
    Tracks specific entities (users, companies, threads) the user has muted.
    """
    __tablename__ = "user_mutes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String(50), nullable=False)  # 'COMPANY', 'USER', 'COMMUNITY'
    target_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_user_mutes_lookup', 'user_id', 'target_type', 'target_id', unique=True),
    )

class Notification(Base):
    """
    The actual in-app Notification inbox for a user.
    """
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    type = Column(String(50), nullable=False)  # 'JOB_ALERT', 'MENTION', 'APPLICATION_UPDATE', etc.
    title = Column(String(255), nullable=False)
    message = Column(String, nullable=False)
    status = Column(String(50), default="unread")
    
    # Metadata for grouping or filtering (e.g., {"company_id": "..."})
    notification_metadata = Column("metadata", JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class PendingDigest(Base):
    """
    Stores batched notifications that are waiting to be sent in a daily/weekly digest email.
    """
    __tablename__ = "pending_digests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    notification_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Integer, JSON, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from .mixins import EnterpriseMixin
from database.core import Base
from datetime import datetime

class NotificationTemplate(EnterpriseMixin, Base):
    __tablename__ = "notification_templates"
    
    name = Column(String(255), nullable=False, unique=True) # e.g. "welcome_email", "job_offer_sms"
    description = Column(String(500), nullable=True)
    
    channel = Column(String(50), nullable=False) # email, sms, in_app, push, webhook
    subject_template = Column(String(500), nullable=True) # Used for emails
    body_template = Column(Text, nullable=False) # Can be HTML or Markdown
    
    # Required context variables like {{user.first_name}}
    required_variables = Column(JSON, default=list)

class Notification(EnterpriseMixin, Base):
    __tablename__ = "notifications"
    
    recipient_id = Column(UUID(as_uuid=True), nullable=False, index=True) # references users.id
    template_id = Column(UUID(as_uuid=True), ForeignKey("notification_templates.id"), nullable=True)
    
    channel = Column(String(50), nullable=False)
    
    # Rendered content
    subject = Column(String(500), nullable=True)
    body = Column(Text, nullable=False)
    
    # Optional deep link / action
    action_url = Column(String(500), nullable=True)
    
    status = Column(String(50), default="PENDING") # PENDING, SENT, DELIVERED, FAILED, READ
    
    sent_at = Column(DateTime(timezone=True), nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Error log or delivery metadata (e.g. message_id from Twilio/SendGrid)
    delivery_metadata = Column(JSON, default=dict)

class NotificationPreference(EnterpriseMixin, Base):
    __tablename__ = "notification_preferences"
    
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # e.g. {"marketing_emails": False, "system_alerts": True, "sms_enabled": False}
    preferences = Column(JSON, default=dict)
    
    quiet_hours_start = Column(String(10), nullable=True) # "22:00"
    quiet_hours_end = Column(String(10), nullable=True) # "08:00"
    timezone = Column(String(50), default="UTC")

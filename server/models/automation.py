import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class WorkflowAutomation(Base):
    __tablename__ = "workflow_automations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=True) # Null if system-wide
    creator_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # The event that fires this workflow (e.g., "APPLICATION_SUBMITTED")
    trigger_event = Column(String, nullable=False)
    
    # JSON logic to evaluate before running (e.g., {"field": "experience", "operator": ">=", "value": 5})
    conditions = Column(JSONB, default=dict)
    
    # Ordered array of actions to perform (e.g., [{"action": "SEND_EMAIL", "template": "abc"}])
    actions = Column(JSONB, default=list)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class AutomationRun(Base):
    __tablename__ = "automation_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey('workflow_automations.id', ondelete='CASCADE'), nullable=False)
    
    trigger_payload = Column(JSONB, default=dict)
    
    # SUCCESS, FAILED, PARTIAL
    status = Column(String, default="SUCCESS")
    error_logs = Column(Text, nullable=True)
    
    executed_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class PlatformTask(Base):
    """Internal tasks for company teams or platform admins."""
    __tablename__ = "platform_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=True)
    
    assignee_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    creator_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    # INTERVIEW_REVIEW, CANDIDATE_FEEDBACK, APPROVAL_REQUEST
    task_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # TODO, IN_PROGRESS, REVIEW, DONE
    status = Column(String, default="TODO")
    priority = Column(String, default="NORMAL") # LOW, NORMAL, HIGH, CRITICAL
    
    due_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class PlatformReminder(Base):
    """Chron-job delayed actions."""
    __tablename__ = "platform_reminders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # INTERVIEW_REMINDER, SUBSCRIPTION_RENEWAL
    reminder_type = Column(String, nullable=False)
    target_entity_id = Column(String, nullable=True) # E.g., The interview ID
    
    execute_at = Column(DateTime(timezone=True), nullable=False)
    is_executed = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organizer_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    
    # e.g. Google Meet URL, Zoom URL
    meeting_url = Column(String, nullable=True)
    
    # INTERVIEW, MENTORSHIP_SESSION, COMPANY_EVENT
    event_type = Column(String, nullable=False)
    target_entity_id = Column(String, nullable=True)
    
    # Array of participant User UUIDs
    participant_ids = Column(JSONB, default=list)
    
    # Sync status with Google/Outlook
    external_provider = Column(String, nullable=True) # GOOGLE, OUTLOOK
    external_event_id = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

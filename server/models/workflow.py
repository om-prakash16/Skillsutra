from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base
from models.mixins import EnterpriseMixin

class Workflow(EnterpriseMixin, Base):
    __tablename__ = "workflows"
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)
    
    # E.g. "Draft", "Published", "Archived"
    status = Column(String, default="Draft")
    
    # Store the entire graph as a JSON blob to avoid massive relational overhead
    # { "nodes": [...], "edges": [...] }
    flow_data = Column(JSONB, default=dict)
    
    tags = Column(JSONB, default=list)

class WorkflowVersion(EnterpriseMixin, Base):
    __tablename__ = "workflow_versions"
    
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    
    flow_data = Column(JSONB, nullable=False)
    changelog = Column(Text, nullable=True)
    is_published = Column(Boolean, default=False)
    
    workflow = relationship("Workflow")

class WorkflowExecution(EnterpriseMixin, Base):
    __tablename__ = "workflow_executions"
    
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    version_id = Column(UUID(as_uuid=True), ForeignKey("workflow_versions.id", ondelete="SET NULL"), nullable=True)
    
    # "Running", "Completed", "Failed", "Paused", "Waiting"
    status = Column(String, default="Running")
    
    started_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    trigger_type = Column(String, nullable=False) # e.g., "webhook", "cron", "manual"
    trigger_data = Column(JSONB, default=dict)
    
    # Final output of the entire workflow
    output_data = Column(JSONB, default=dict)
    
    workflow = relationship("Workflow")

class WorkflowExecutionLog(EnterpriseMixin, Base):
    __tablename__ = "workflow_execution_logs"
    
    execution_id = Column(UUID(as_uuid=True), ForeignKey("workflow_executions.id", ondelete="CASCADE"), nullable=False)
    node_id = Column(String, nullable=False) # ID from the frontend React Flow
    
    # "Success", "Failed", "Retrying"
    status = Column(String, nullable=False)
    
    started_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    input_data = Column(JSONB, default=dict)
    output_data = Column(JSONB, default=dict)
    error_message = Column(Text, nullable=True)

class WorkflowWebhook(EnterpriseMixin, Base):
    __tablename__ = "workflow_webhooks"
    
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    
    path = Column(String, unique=True, index=True, nullable=False) # E.g., a UUID or slug
    method = Column(String, default="POST")
    
    is_active = Column(Boolean, default=True)
    require_signature = Column(Boolean, default=False)
    secret_key = Column(String, nullable=True) # Used if require_signature is True

class WorkflowSchedule(EnterpriseMixin, Base):
    __tablename__ = "workflow_schedules"
    
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    
    cron_expression = Column(String, nullable=False)
    timezone = Column(String, default="UTC")
    is_active = Column(Boolean, default=True)
    
    last_run_at = Column(DateTime(timezone=True), nullable=True)
    next_run_at = Column(DateTime(timezone=True), nullable=True)

class WorkflowEvent(EnterpriseMixin, Base):
    """
    Internal Event Bus table (Event Sourcing)
    """
    __tablename__ = "workflow_events"
    
    event_type = Column(String, index=True, nullable=False) # e.g., "UserCreated", "PaymentSucceeded"
    payload = Column(JSONB, nullable=False)
    
    source = Column(String, nullable=True) # E.g., "cms", "billing"
    status = Column(String, default="Pending") # Pending -> Processed

class WorkflowApproval(EnterpriseMixin, Base):
    """
    Human-in-the-loop approvals
    """
    __tablename__ = "workflow_approvals"
    
    execution_id = Column(UUID(as_uuid=True), ForeignKey("workflow_executions.id", ondelete="CASCADE"), nullable=False)
    node_id = Column(String, nullable=False)
    
    assignee_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assignee_role = Column(String, nullable=True)
    
    # "Pending", "Approved", "Rejected"
    status = Column(String, default="Pending")
    comments = Column(Text, nullable=True)
    
    timeout_at = Column(DateTime(timezone=True), nullable=True)

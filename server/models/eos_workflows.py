import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class WorkflowAutomation(Base):
    """
    No-Code Orchestration Engine.
    Allows companies and users to build custom IFTTT-style pipelines.
    """
    __tablename__ = "eos_workflow_automations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    is_active = Column(Boolean, default=True)
    
    # Workflow Logic (Trigger -> Condition -> Action)
    # Example Trigger: {"event": "candidate.applied"}
    # Example Condition: {"field": "ai_match_score", "operator": ">=", "value": 85}
    # Example Action: {"type": "send_slack_message", "channel": "#hiring"}
    trigger_config = Column(JSONB, nullable=False)
    condition_config = Column(JSONB, nullable=True) 
    action_config = Column(JSONB, nullable=False)
    
    execution_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class WorkflowExecutionLog(Base):
    """
    Tracks the success or failure of automated workflows.
    """
    __tablename__ = "eos_workflow_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey('eos_workflow_automations.id', ondelete='CASCADE'), nullable=False)
    
    status = Column(String, nullable=False) # SUCCESS, FAILED
    error_message = Column(String, nullable=True)
    
    executed_at = Column(DateTime(timezone=True), default=datetime.utcnow)

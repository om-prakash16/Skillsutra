import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class UserRoleScope(Base):
    __tablename__ = "user_roles_scopes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    
    # Scopes
    platform_scope = Column(Boolean, default=False)  # If true, applies to all tenants
    tenant_id = Column(String, nullable=True)
    org_id = Column(String, nullable=True)
    workspace_id = Column(String, nullable=True)
    department_id = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships are handled by back_populates if defined


class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requester_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action_type = Column(String, nullable=False) # e.g. "PROMOTE_ADMIN"
    payload = Column(JSONB, nullable=True)        # The data to be applied once approved
    status = Column(String, default="pending")   # pending, approved, rejected
    reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    signatures = relationship("ApprovalSignature", back_populates="request", cascade="all, delete-orphan")


class ApprovalSignature(Base):
    __tablename__ = "approval_signatures"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey("approval_requests.id", ondelete="CASCADE"), nullable=False)
    approver_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    decision = Column(String, nullable=False)    # "approved", "rejected"
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    request = relationship("ApprovalRequest", back_populates="signatures")

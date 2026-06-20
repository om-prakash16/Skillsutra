from sqlalchemy import Column, String, Boolean, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base
from models.mixins import EnterpriseMixin
import uuid

class Organization(EnterpriseMixin, Base):
    """
    The top-level Tenant in the multi-tenant architecture.
    """
    __tablename__ = "organizations"

    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    domain = Column(String, unique=True, nullable=True, index=True)
    
    logo_url = Column(String, nullable=True)
    theme_settings = Column(JSONB, default=dict) # Brand colors, typography
    billing_plan = Column(String, default="free")
    
    is_active = Column(Boolean, default=True)
    
    # Relationships
    workspaces = relationship("Workspace", back_populates="organization", cascade="all, delete-orphan")
    teams = relationship("Team", back_populates="organization", cascade="all, delete-orphan")


class Workspace(EnterpriseMixin, Base):
    """
    A logical grouping of projects/resources within an Organization.
    """
    __tablename__ = "workspaces"

    name = Column(String, nullable=False)
    slug = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    
    is_active = Column(Boolean, default=True)

    # Relationships
    organization = relationship("Organization", back_populates="workspaces")


class Team(EnterpriseMixin, Base):
    """
    A logical grouping of Users within an Organization.
    """
    __tablename__ = "teams"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="teams")


class TenantRole(EnterpriseMixin, Base):
    """
    Custom roles defined per-tenant (Organization) rather than globally.
    """
    __tablename__ = "tenant_roles"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_system_role = Column(Boolean, default=False) # e.g. "Owner", "Admin" cannot be deleted
    
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)


class TenantPermission(EnterpriseMixin, Base):
    """
    Mapping of granular actions to TenantRoles (RBAC).
    """
    __tablename__ = "tenant_permissions"

    role_id = Column(UUID(as_uuid=True), ForeignKey("tenant_roles.id", ondelete="CASCADE"), nullable=False)
    
    resource = Column(String, nullable=False) # e.g. "cms_pages", "billing"
    action = Column(String, nullable=False)   # e.g. "create", "read", "update", "delete"
    conditions = Column(JSONB, nullable=True) # ABAC conditions (e.g., {"created_by": "{{user.id}}"})

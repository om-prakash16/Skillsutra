from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Enum, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base
from models.mixins import EnterpriseMixin

class AuthzFeatureFlag(EnterpriseMixin, Base):
    """
    Global toggles for features across the platform (e.g., AI_BUILDER_ENABLED).
    """
    __tablename__ = "authz_feature_flags"

    key = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_enabled_globally = Column(Boolean, default=False)
    
    # Optional rollout strategy
    rollout_percentage = Column(Integer, default=0) # 0 to 100


class FeatureAssignment(EnterpriseMixin, Base):
    """
    Overrides FeatureFlags for specific Organizations or Workspaces.
    Useful for Beta testing or Enterprise early access.
    """
    __tablename__ = "feature_assignments"

    feature_id = Column(UUID(as_uuid=True), ForeignKey("authz_feature_flags.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String, nullable=False) # "organization", "workspace", "user"
    target_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    is_enabled = Column(Boolean, nullable=False)

    feature = relationship("AuthzFeatureFlag")





class ResourcePolicy(EnterpriseMixin, Base):
    """
    Attribute-Based Access Control (ABAC) Policies.
    Evaluated by the AuthorizationService dynamically.
    """
    __tablename__ = "resource_policies"

    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # e.g., "cms.pages.*", "billing.invoices.approve"
    resource_action = Column(String, nullable=False, index=True) 
    
    effect = Column(String, default="allow") # "allow" or "deny"
    
    # JSON containing the conditions:
    # { "user.department": {"$eq": "HR"}, "request.ip": {"$in": ["10.0.0.0/8"]} }
    conditions = Column(JSONB, nullable=False, default=dict)

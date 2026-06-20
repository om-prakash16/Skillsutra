import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class MarketplaceApp(Base):
    """
    3rd-party apps (e.g. Zoom, HackerRank, Slack) built by developers
    for companies to install into their SkillSutra environment.
    """
    __tablename__ = "marketplace_apps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    developer_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False) # e.g. "Assessment", "Video Interview", "HR"
    
    logo_url = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False) # Requires Super Admin approval
    
    # Billing
    is_paid = Column(Boolean, default=False)
    price_monthly = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class AppInstall(Base):
    """
    Tracks which Company has installed which MarketplaceApp.
    """
    __tablename__ = "app_installs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    app_id = Column(UUID(as_uuid=True), ForeignKey('marketplace_apps.id', ondelete='CASCADE'), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    
    installed_by_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    config_json = Column(JSONB, nullable=True) # Stores company-specific API tokens for the 3rd party app
    is_active = Column(Boolean, default=True)
    
    installed_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class OAuthApp(Base):
    """
    Turns SkillSutra into an Identity Provider (IdP).
    Allows external apps to offer "Log in with SkillSutra".
    """
    __tablename__ = "oauth_apps"

    client_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    developer_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    app_name = Column(String, nullable=False)
    client_secret_hash = Column(String, nullable=False)
    
    redirect_uris = Column(JSONB, nullable=False) # Array of allowed callback URLs
    scopes_required = Column(JSONB, nullable=False) # e.g. ["read:profile", "write:applications"]
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Computed
from sqlalchemy.dialects.postgresql import UUID, TSVECTOR, JSONB
from sqlalchemy.orm import relationship
from core.database import Base
import models.core

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=True)
    password_hash = Column(String, nullable=True)
    user_code = Column(String, unique=True, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    auth_provider = Column(String, default="local")
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    github_id = Column(String, nullable=True)
    google_id = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    github_data = Column(JSONB, nullable=True)
    dynamic_profile_data = Column(JSONB, nullable=True)
    sidebar_preferences = Column(JSONB, nullable=True)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    profile_synced_at = Column(DateTime(timezone=True), nullable=True)
    locale = Column(String, nullable=True)
    account_creation_method = Column(String, default="email")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    search_vector = Column(TSVECTOR, Computed("to_tsvector('english', coalesce(username, '') || ' ' || coalesce(email, ''))"))

    # Relationships
    roles = relationship("Role", secondary="user_roles", back_populates="users", lazy="selectin")

    from sqlalchemy import CheckConstraint
    __table_args__ = (
        CheckConstraint(
            "username ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'",
            name="chk_username_format"
        ),
    )

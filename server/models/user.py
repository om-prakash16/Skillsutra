import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float
from sqlalchemy.dialects.postgresql import UUID
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_address = Column(String, unique=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    username = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    reputation_score = Column(Float, default=0.0)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    auth_provider = Column(String, default="local")
    github_id = Column(String, nullable=True)
    google_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

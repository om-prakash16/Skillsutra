import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Computed
from sqlalchemy.dialects.postgresql import UUID, TSVECTOR
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=True)
    password_hash = Column(String, nullable=True)
    user_code = Column(String, unique=True, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    search_vector = Column(TSVECTOR, Computed("to_tsvector('english', coalesce(username, '') || ' ' || coalesce(email, ''))"))

    # Relationships
    roles = relationship("Role", secondary="user_roles", back_populates="users", lazy="selectin")

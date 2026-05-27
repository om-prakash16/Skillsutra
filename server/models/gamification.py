import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class UserReputation(Base):
    """Tracks a user's gamification stats globally across the platform."""
    __tablename__ = "user_reputations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    xp_points = Column(Integer, default=0)
    current_level = Column(Integer, default=1)
    longest_streak = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    
    last_action_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


class AchievementBadge(Base):
    """Static definitions of badges users can earn."""
    __tablename__ = "achievement_badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String, nullable=True)
    
    # Metadata for the rules engine (e.g., {"event": "course_completed", "count": 5})
    condition_rules = Column(JSONB, default=dict)
    xp_reward = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


class UserBadge(Base):
    """Mapping of badges earned by specific users."""
    __tablename__ = "user_badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    badge_id = Column(UUID(as_uuid=True), ForeignKey('achievement_badges.id', ondelete='CASCADE'), nullable=False)
    
    earned_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User")
    badge = relationship("AchievementBadge")

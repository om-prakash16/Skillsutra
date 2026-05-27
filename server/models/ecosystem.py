import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey, Text, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from core.database import Base

# ==========================================
# CONTESTS & CHALLENGES
# ==========================================
class Contest(Base):
    __tablename__ = "contests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    
    is_team_based = Column(Boolean, default=False)
    sponsor_company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='SET NULL'), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class ChallengeSubmission(Base):
    __tablename__ = "challenge_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contest_id = Column(UUID(as_uuid=True), ForeignKey('contests.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    code_payload = Column(Text, nullable=False)
    language = Column(String, default="python")
    
    execution_score = Column(Float, nullable=True)
    ai_quality_score = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


# ==========================================
# GIG ECONOMY
# ==========================================
class Gig(Base):
    __tablename__ = "gigs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    budget_range = Column(JSONB, default=dict) # {"min": 500, "max": 1000, "currency": "USD"}
    milestones = Column(JSONB, default=list)
    
    embedding = Column(Vector(768), nullable=True) # For AI matching
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (
        Index('ix_gigs_embedding_hnsw', 'embedding', postgresql_using='hnsw', postgresql_with={'m': 16, 'ef_construction': 64}, postgresql_ops={'embedding': 'vector_cosine_ops'}),
    )

class GigContract(Base):
    __tablename__ = "gig_contracts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gig_id = Column(UUID(as_uuid=True), ForeignKey('gigs.id', ondelete='CASCADE'), nullable=False)
    freelancer_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    status = Column(String, default="ACTIVE") # ACTIVE, COMPLETED, DISPUTED
    payment_status = Column(String, default="PENDING")
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


# ==========================================
# FEED & HABITS
# ==========================================
class FeedItem(Base):
    __tablename__ = "feed_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    entity_type = Column(String, nullable=False) # JOB, POST, CONTEST, GIG
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    
    popularity_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class DailyHabit(Base):
    __tablename__ = "daily_habits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    habit_type = Column(String, nullable=False) # APPLY_JOB, CODE_CHALLENGE, WATCH_COURSE
    target_count = Column(Integer, default=1)
    
    current_streak = Column(Integer, default=0)
    last_completed_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

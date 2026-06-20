import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    
    query = Column(String, nullable=False)
    filters_applied = Column(JSONB, default=dict)
    
    results_count = Column(Integer, default=0)
    clicked_result_id = Column(String, nullable=True) # Tracks conversion
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class SavedSearch(Base):
    __tablename__ = "saved_searches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    name = Column(String, nullable=False)
    query_params = Column(JSONB, nullable=False)
    
    alert_enabled = Column(Boolean, default=True)
    alert_frequency = Column(String, default="DAILY") # DAILY, WEEKLY, INSTANT
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class KnowledgeGraphEdge(Base):
    """
    Represents relationships between entities (e.g. Skill -> Skill, Company -> Skill, User -> Skill).
    """
    __tablename__ = "knowledge_graph_edges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    source_type = Column(String, nullable=False) # SKILL, USER, COMPANY, JOB
    source_id = Column(String, nullable=False)
    
    target_type = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    
    relationship_type = Column(String, nullable=False) # REQUIRES, HAS_SKILL, SIMILAR_TO, PRE-REQUISITE
    weight = Column(Float, default=1.0) # Strength of relationship (0.0 to 1.0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from core.database import Base

class TaxonomySkill(Base):
    __tablename__ = "taxonomy_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    aliases = Column(JSONB, default=list) # e.g. ["JS", "ECMAScript"]
    is_verified = Column(Boolean, default=True)
    
    category = Column(String, nullable=True) # e.g. "Frontend", "Backend", "Soft Skill"
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class TaxonomyIndustry(Base):
    __tablename__ = "taxonomy_industries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class TaxonomyJobCategory(Base):
    __tablename__ = "taxonomy_job_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    parent_id = Column(UUID(as_uuid=True), nullable=True) # For nested categories
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

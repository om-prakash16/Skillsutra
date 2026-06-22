import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Table, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

# Many-to-Many association for User and Role
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', UUID(as_uuid=True), ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True)
)

class Role(Base):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    is_template = Column(Boolean, default=False)
    permissions = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    users = relationship("User", secondary=user_roles, back_populates="roles")



class Company(Base):
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name = Column(String, nullable=False)
    created_by_user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    industry = Column(String, nullable=True)
    
    # B2B Ecosystem Expansions
    branding_profile = Column(JSONB, default=dict) # logo, banner, tech stack, culture, locations, website
    company_metadata = Column(JSONB, default=dict) # employee count, funding stage, benefits
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    members = relationship("CompanyMember", back_populates="company")

class CompanyMember(Base):
    __tablename__ = "company_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # OWNER, ADMIN, HR, RECRUITER, HIRING_MANAGER, INTERVIEWER
    company_role = Column(String, default="MEMBER")
    permissions = Column(JSONB, default=list)
    performance_metrics = Column(JSONB, default=dict) # hires made, time-to-hire, etc.

    company = relationship("Company", back_populates="members")
    user = relationship("User")
    
    __table_args__ = (
        UniqueConstraint('company_id', 'user_id', name='uix_company_member'),
    )

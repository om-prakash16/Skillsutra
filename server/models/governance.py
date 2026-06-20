import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from core.database import Base

class RetentionPolicy(Base):
    """
    Automated data deletion rules (e.g., delete inactive resumes after 3 years).
    """
    __tablename__ = "retention_policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    data_type = Column(String, nullable=False) # e.g., "APPLICATIONS", "MESSAGES", "AUDIT_LOGS"
    
    retention_days = Column(Integer, nullable=False) 
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class LegalHold(Base):
    """
    Overrides RetentionPolicy. 
    Prevents data deletion during lawsuits or regulatory investigations.
    """
    __tablename__ = "legal_holds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.id', ondelete='CASCADE'), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    
    reason = Column(String, nullable=False) # e.g. "Pending SEC Investigation"
    
    placed_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    released_at = Column(DateTime(timezone=True), nullable=True) # If null, hold is ACTIVE

class RiskRegister(Base):
    """
    Tracks identified organizational, vendor, and security risks for compliance audits.
    """
    __tablename__ = "risk_register"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    risk_title = Column(String, nullable=False)
    risk_category = Column(String, nullable=False) # FINANCIAL, OPERATIONAL, SECURITY, VENDOR
    severity = Column(String, nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    
    mitigation_plan = Column(Text, nullable=False)
    status = Column(String, default="OPEN") # OPEN, MITIGATED, ACCEPTED
    
    identified_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class Vendor(Base):
    """
    Sub-processor register. Tracks 3rd party services holding our data (SOC-2 requirement).
    """
    __tablename__ = "vendors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    name = Column(String, nullable=False) # e.g., AWS, SendGrid, Stripe
    service_type = Column(String, nullable=False) # HOSTING, EMAIL, PAYMENTS
    
    data_processed = Column(String, nullable=False) # What PII do they hold?
    soc2_verified = Column(Boolean, default=False)
    
    last_review_date = Column(DateTime(timezone=True), nullable=True)

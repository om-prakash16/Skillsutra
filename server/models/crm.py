from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Integer, JSON, Boolean, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship
from .mixins import EnterpriseMixin
from database.core import Base

# --- Unified Candidate Identity ---

class CRMContact(EnterpriseMixin, Base):
    """Maps 1:1 with ATSCandidate to provide the unified identity."""
    __tablename__ = "crm_contacts"
    
    # Linked to ATSCandidate. If null, they are a pure CRM prospect not yet in ATS.
    ats_candidate_id = Column(UUID(as_uuid=True), ForeignKey("ats_candidates.id", ondelete="SET NULL"), nullable=True, unique=True)
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    
    # GDPR & Consent
    opted_in = Column(Boolean, default=False)
    consent_recorded_at = Column(DateTime(timezone=True), nullable=True)
    
    # AI & Engagement
    engagement_score = Column(Float, default=0.0)
    ai_interest_prediction = Column(String(100), nullable=True)
    
    memberships = relationship("CRMMembership", back_populates="contact", cascade="all, delete-orphan")
    activities = relationship("CRMActivity", back_populates="contact", cascade="all, delete-orphan")

# --- Talent Communities & Segmentation ---

class CRMTalentCommunity(EnterpriseMixin, Base):
    __tablename__ = "crm_talent_communities"
    
    name = Column(String(255), nullable=False) # e.g. "Frontend Engineers" or "Campus Hires 2026"
    description = Column(Text, nullable=True)
    tags = Column(JSON, default=list)
    
    # Dynamic rules for automatic membership (e.g. "skill CONTAINS React")
    dynamic_rules = Column(JSON, nullable=True)
    
    memberships = relationship("CRMMembership", back_populates="community", cascade="all, delete-orphan")

class CRMMembership(EnterpriseMixin, Base):
    __tablename__ = "crm_memberships"
    
    contact_id = Column(UUID(as_uuid=True), ForeignKey("crm_contacts.id", ondelete="CASCADE"), nullable=False)
    community_id = Column(UUID(as_uuid=True), ForeignKey("crm_talent_communities.id", ondelete="CASCADE"), nullable=False)
    
    source = Column(String(100), default="manual") # manual, dynamic_rule, form_submission
    
    contact = relationship("CRMContact", back_populates="memberships")
    community = relationship("CRMTalentCommunity", back_populates="memberships")

# --- Campaigns & Outreach ---

class CRMCampaign(EnterpriseMixin, Base):
    __tablename__ = "crm_campaigns"
    
    name = Column(String(255), nullable=False)
    type = Column(String(50), default="email") # email, sms, whatsapp
    status = Column(String(50), default="draft") # draft, scheduled, active, completed
    
    target_community_id = Column(UUID(as_uuid=True), ForeignKey("crm_talent_communities.id", ondelete="SET NULL"), nullable=True)
    
    subject_template = Column(String(255), nullable=True)
    body_template = Column(Text, nullable=False)
    
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Analytics
    sent_count = Column(Integer, default=0)
    open_count = Column(Integer, default=0)
    click_count = Column(Integer, default=0)

class CRMCampaignMessage(EnterpriseMixin, Base):
    __tablename__ = "crm_campaign_messages"
    
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("crm_campaigns.id", ondelete="CASCADE"), nullable=False)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("crm_contacts.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(String(50), default="pending") # pending, sent, failed, opened, clicked
    sent_at = Column(DateTime(timezone=True), nullable=True)

# --- Forms & Landing Pages ---

class CRMLandingPage(EnterpriseMixin, Base):
    """Integrates with the Visual Builder & CMS."""
    __tablename__ = "crm_landing_pages"
    
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    
    # Visual Builder JSON
    component_tree = Column(JSON, nullable=False)
    
    is_published = Column(Boolean, default=False)

class CRMForm(EnterpriseMixin, Base):
    __tablename__ = "crm_forms"
    
    name = Column(String(255), nullable=False)
    schema = Column(JSON, nullable=False) # JSON schema defining the fields
    
    target_community_id = Column(UUID(as_uuid=True), ForeignKey("crm_talent_communities.id", ondelete="SET NULL"), nullable=True)

class CRMFormSubmission(EnterpriseMixin, Base):
    __tablename__ = "crm_form_submissions"
    
    form_id = Column(UUID(as_uuid=True), ForeignKey("crm_forms.id", ondelete="CASCADE"), nullable=False)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("crm_contacts.id", ondelete="SET NULL"), nullable=True)
    
    payload = Column(JSON, nullable=False)

# --- Unified Activity Timeline ---

class CRMActivity(EnterpriseMixin, Base):
    """The chronological timeline of every touchpoint for a candidate."""
    __tablename__ = "crm_activities"
    
    contact_id = Column(UUID(as_uuid=True), ForeignKey("crm_contacts.id", ondelete="CASCADE"), nullable=False)
    
    activity_type = Column(String(100), nullable=False) # e.g. "email_opened", "form_submitted", "ats_applied", "interview_scheduled"
    
    title = Column(String(255), nullable=False)
    details = Column(JSON, default=dict)
    
    # Can link out to foreign domains like ATS applications
    reference_id = Column(UUID(as_uuid=True), nullable=True)
    reference_type = Column(String(100), nullable=True)
    
    contact = relationship("CRMContact", back_populates="activities")

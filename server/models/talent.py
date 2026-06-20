from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Integer, JSON, Boolean, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship
from .mixins import EnterpriseMixin
from database.core import Base

# --- Core Talent Identity ---

class TalentProfile(EnterpriseMixin, Base):
    """The lifelong canonical professional identity for a user.
    Maps 1:1 with core users.id."""
    __tablename__ = "talent_profiles"
    
    user_id = Column(UUID(as_uuid=True), nullable=False, unique=True, index=True) # References users.id
    
    # Public Slug (e.g. /u/alex-smith)
    username = Column(String(100), nullable=False, unique=True, index=True)
    
    headline = Column(String(255), nullable=True) # e.g. "Senior React Engineer"
    bio = Column(Text, nullable=True)
    
    location = Column(String(255), nullable=True)
    time_zone = Column(String(100), nullable=True)
    languages = Column(JSON, default=list) # e.g. ["English", "Spanish"]
    
    # Public Settings
    is_public = Column(Boolean, default=True)
    open_to_work = Column(Boolean, default=False)
    
    # Relationships
    experiences = relationship("TalentExperience", back_populates="profile", cascade="all, delete-orphan")
    educations = relationship("TalentEducation", back_populates="profile", cascade="all, delete-orphan")
    skills = relationship("TalentSkill", back_populates="profile", cascade="all, delete-orphan")
    portfolios = relationship("TalentPortfolio", back_populates="profile", cascade="all, delete-orphan")
    certifications = relationship("TalentCertification", back_populates="profile", cascade="all, delete-orphan")

# --- Normalized Skills Graph ---

class SkillTaxonomy(EnterpriseMixin, Base):
    """Global dictionary of normalized skills."""
    __tablename__ = "skill_taxonomy"
    
    name = Column(String(255), nullable=False, unique=True, index=True) # e.g. "React"
    category = Column(String(100), nullable=True) # e.g. "Frontend Framework"
    is_verified = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

class SkillAlias(EnterpriseMixin, Base):
    """Handles parsing mismatches (e.g. 'ReactJS' -> 'React')."""
    __tablename__ = "skill_aliases"
    
    alias_name = Column(String(255), nullable=False, unique=True, index=True)
    canonical_skill_id = Column(UUID(as_uuid=True), ForeignKey("skill_taxonomy.id"), nullable=False)

class TalentSkill(EnterpriseMixin, Base):
    """A person's specific claim to a skill in the taxonomy."""
    __tablename__ = "talent_skills"
    
    profile_id = Column(UUID(as_uuid=True), ForeignKey("talent_profiles.id"), nullable=False)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skill_taxonomy.id"), nullable=False)
    
    proficiency_level = Column(String(50), default="intermediate") # beginner, intermediate, advanced, expert
    years_experience = Column(Float, nullable=True)
    last_used_year = Column(Integer, nullable=True)
    
    ai_confidence_score = Column(Float, nullable=True) # 0 to 1
    
    profile = relationship("TalentProfile", back_populates="skills")
    skill = relationship("SkillTaxonomy")

# --- Experience & Education ---

class TalentExperience(EnterpriseMixin, Base):
    __tablename__ = "talent_experience"
    
    profile_id = Column(UUID(as_uuid=True), ForeignKey("talent_profiles.id"), nullable=False)
    
    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    employment_type = Column(String(100), nullable=True) # full-time, contract, freelance
    
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    is_current = Column(Boolean, default=False)
    
    description = Column(Text, nullable=True)
    technologies_used = Column(JSON, default=list) # String list matching skills
    
    profile = relationship("TalentProfile", back_populates="experiences")

class TalentEducation(EnterpriseMixin, Base):
    __tablename__ = "talent_education"
    
    profile_id = Column(UUID(as_uuid=True), ForeignKey("talent_profiles.id"), nullable=False)
    
    institution = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=True)
    field_of_study = Column(String(255), nullable=True)
    
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    
    grade = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    
    profile = relationship("TalentProfile", back_populates="educations")

# --- Portfolios & Certifications ---

class TalentPortfolio(EnterpriseMixin, Base):
    __tablename__ = "talent_portfolios"
    
    profile_id = Column(UUID(as_uuid=True), ForeignKey("talent_profiles.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    project_url = Column(String(500), nullable=True)
    repository_url = Column(String(500), nullable=True)
    
    # Store MediaAsset IDs
    images = Column(JSON, default=list)
    
    technologies = Column(JSON, default=list)
    
    profile = relationship("TalentProfile", back_populates="portfolios")

class TalentCertification(EnterpriseMixin, Base):
    __tablename__ = "talent_certifications"
    
    profile_id = Column(UUID(as_uuid=True), ForeignKey("talent_profiles.id"), nullable=False)
    
    name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=False)
    
    issue_date = Column(DateTime(timezone=True), nullable=True)
    expiry_date = Column(DateTime(timezone=True), nullable=True)
    
    credential_id = Column(String(255), nullable=True)
    credential_url = Column(String(500), nullable=True)
    
    profile = relationship("TalentProfile", back_populates="certifications")

# --- Verification ---

class TalentVerification(EnterpriseMixin, Base):
    __tablename__ = "talent_verifications"
    
    profile_id = Column(UUID(as_uuid=True), ForeignKey("talent_profiles.id"), nullable=False)
    
    entity_type = Column(String(100), nullable=False) # e.g. "education", "experience", "identity"
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    
    status = Column(String(50), default="pending") # pending, verified, rejected
    verification_method = Column(String(100), nullable=True) # e.g. "background_check", "email_domain", "manual"
    
    verified_at = Column(DateTime(timezone=True), nullable=True)
    verified_by = Column(UUID(as_uuid=True), nullable=True) # Admin User ID

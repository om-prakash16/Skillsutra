from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Integer, JSON, Boolean, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship
from .mixins import EnterpriseMixin
from database.core import Base

# --- Course Catalog ---

class LearningCourse(EnterpriseMixin, Base):
    __tablename__ = "learning_courses"
    
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    
    difficulty = Column(String(50), default="beginner") # beginner, intermediate, advanced
    estimated_duration_minutes = Column(Integer, default=0)
    
    # Store MediaAsset IDs for thumbnail/promo video
    thumbnail_url = Column(String(500), nullable=True)
    
    # Required skills to start
    prerequisite_skills = Column(JSON, default=list)
    # Skills granted upon completion
    granted_skills = Column(JSON, default=list)
    
    modules = relationship("LearningModule", back_populates="course", cascade="all, delete-orphan", order_by="LearningModule.sequence")
    enrollments = relationship("LearningEnrollment", back_populates="course", cascade="all, delete-orphan")

class LearningModule(EnterpriseMixin, Base):
    __tablename__ = "learning_modules"
    
    course_id = Column(UUID(as_uuid=True), ForeignKey("learning_courses.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    sequence = Column(Integer, default=0)
    
    course = relationship("LearningCourse", back_populates="modules")
    lessons = relationship("LearningLesson", back_populates="module", cascade="all, delete-orphan", order_by="LearningLesson.sequence")

class LearningLesson(EnterpriseMixin, Base):
    __tablename__ = "learning_lessons"
    
    module_id = Column(UUID(as_uuid=True), ForeignKey("learning_modules.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    sequence = Column(Integer, default=0)
    type = Column(String(50), default="video") # video, article, interactive
    
    content = Column(Text, nullable=True) # Markdown or HTML
    video_url = Column(String(500), nullable=True) # e.g. Vimeo/YouTube embed
    
    module = relationship("LearningModule", back_populates="lessons")

class LearningPath(EnterpriseMixin, Base):
    __tablename__ = "learning_paths"
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # e.g. ["course_id_1", "course_id_2"]
    course_ids = Column(JSON, default=list)

# --- Enrollments & Progress ---

class LearningEnrollment(EnterpriseMixin, Base):
    __tablename__ = "learning_enrollments"
    
    course_id = Column(UUID(as_uuid=True), ForeignKey("learning_courses.id"), nullable=False)
    talent_profile_id = Column(UUID(as_uuid=True), ForeignKey("talent_profiles.id"), nullable=False)
    
    status = Column(String(50), default="in_progress") # in_progress, completed, dropped
    progress_percentage = Column(Float, default=0.0)
    
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    course = relationship("LearningCourse", back_populates="enrollments")

class LearningProgress(EnterpriseMixin, Base):
    __tablename__ = "learning_progress"
    
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("learning_enrollments.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("learning_lessons.id"), nullable=False)
    
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

# --- Assessments ---

class LearningAssessment(EnterpriseMixin, Base):
    __tablename__ = "learning_assessments"
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    course_id = Column(UUID(as_uuid=True), ForeignKey("learning_courses.id", ondelete="SET NULL"), nullable=True)
    
    time_limit_minutes = Column(Integer, nullable=True)
    passing_score_percentage = Column(Float, default=70.0)
    
    questions = relationship("LearningAssessmentQuestion", back_populates="assessment", cascade="all, delete-orphan")

class LearningAssessmentQuestion(EnterpriseMixin, Base):
    __tablename__ = "learning_assessment_questions"
    
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("learning_assessments.id", ondelete="CASCADE"), nullable=False)
    
    type = Column(String(50), default="mcq") # mcq, coding, essay
    prompt = Column(Text, nullable=False)
    
    # JSON schema holding options, correct answer, or test cases for coding
    payload = Column(JSON, nullable=False) 
    
    points = Column(Integer, default=1)
    
    assessment = relationship("LearningAssessment", back_populates="questions")

class LearningAssessmentAttempt(EnterpriseMixin, Base):
    __tablename__ = "learning_assessment_attempts"
    
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("learning_assessments.id", ondelete="CASCADE"), nullable=False)
    talent_profile_id = Column(UUID(as_uuid=True), ForeignKey("talent_profiles.id"), nullable=False)
    
    score = Column(Float, nullable=True)
    passed = Column(Boolean, nullable=True)
    
    started_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # The actual answers submitted by the user
    submitted_answers = Column(JSON, default=dict)

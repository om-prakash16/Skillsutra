import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from core.database import Base

class NavigationModule(Base):
    __tablename__ = "navigation_modules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    label = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    order_index = Column(Integer, default=0)
    required_role = Column(String, nullable=True)
    
    subgroups = relationship("NavigationSubGroup", back_populates="module", order_by="NavigationSubGroup.order_index", cascade="all, delete-orphan")
    links = relationship("NavigationLink", back_populates="module", order_by="NavigationLink.order_index", cascade="all, delete-orphan")

class NavigationSubGroup(Base):
    __tablename__ = "navigation_subgroups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("navigation_modules.id", ondelete="CASCADE"), nullable=False)
    label = Column(String, nullable=False)
    order_index = Column(Integer, default=0)
    required_role = Column(String, nullable=True)

    module = relationship("NavigationModule", back_populates="subgroups")
    links = relationship("NavigationLink", back_populates="subgroup", order_by="NavigationLink.order_index", cascade="all, delete-orphan")

class NavigationLink(Base):
    __tablename__ = "navigation_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("navigation_modules.id", ondelete="CASCADE"), nullable=True)
    subgroup_id = Column(UUID(as_uuid=True), ForeignKey("navigation_subgroups.id", ondelete="CASCADE"), nullable=True)
    
    label = Column(String, nullable=False)
    href = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    exact = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    required_role = Column(String, nullable=True)

    module = relationship("NavigationModule", back_populates="links")
    subgroup = relationship("NavigationSubGroup", back_populates="links")

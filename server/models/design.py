from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Boolean, JSON, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from .mixins import EnterpriseMixin
from database.core import Base

class Theme(EnterpriseMixin, Base):
    __tablename__ = "themes"
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_default = Column(Boolean, default=False)
    is_dark = Column(Boolean, default=False)
    
    tokens = relationship("ThemeToken", back_populates="theme", cascade="all, delete-orphan")

class ThemeToken(EnterpriseMixin, Base):
    __tablename__ = "theme_tokens"
    
    theme_id = Column(UUID(as_uuid=True), ForeignKey("themes.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)  # e.g., primary, secondary, radius-md
    category = Column(String(100), nullable=False)  # e.g., colors, typography, spacing
    value = Column(String(255), nullable=False)  # e.g., #ff0000, 0.5rem
    
    theme = relationship("Theme", back_populates="tokens")

class GlobalStyle(EnterpriseMixin, Base):
    __tablename__ = "global_styles"
    
    name = Column(String(255), nullable=False)  # e.g., Global Button, Global Card
    component_type = Column(String(100), nullable=False)  # e.g., button, card
    style_props = Column(JSON, default=dict)  # The properties JSON that gets merged

class ComponentStyle(EnterpriseMixin, Base):
    __tablename__ = "component_styles"
    
    component_id = Column(UUID(as_uuid=True), nullable=False, index=True) # ID of block in canvas
    page_id = Column(UUID(as_uuid=True), ForeignKey("cms_pages.id", ondelete="CASCADE"), nullable=True)
    style_props = Column(JSON, default=dict) # Breakpoint specific style props
    
class StylePreset(EnterpriseMixin, Base):
    __tablename__ = "style_presets"
    
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    style_props = Column(JSON, default=dict)

class Variable(EnterpriseMixin, Base):
    __tablename__ = "variables"
    
    name = Column(String(255), nullable=False)
    scope = Column(String(50), nullable=False) # global, tenant, workspace, page
    type = Column(String(50), nullable=False) # string, number, boolean, json
    value = Column(JSON, nullable=True)

class Binding(EnterpriseMixin, Base):
    __tablename__ = "bindings"
    
    component_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    property_name = Column(String(255), nullable=False) # e.g. text, src
    binding_type = Column(String(50), nullable=False) # variable, cms, api, ai
    binding_path = Column(String(500), nullable=False) # e.g. variables.global.site_name
    
class PropertyHistory(EnterpriseMixin, Base):
    __tablename__ = "property_history"
    
    component_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    property_name = Column(String(255), nullable=False)
    previous_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)

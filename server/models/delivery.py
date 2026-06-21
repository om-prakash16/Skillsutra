from sqlalchemy import Column, String, Integer, JSON, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .mixins import EnterpriseMixin
from database.core import Base

class Route(EnterpriseMixin, Base):
    """
    Maps a URL path to a specific entity in the system.
    This eliminates hardcoded Next.js routes.
    """
    __tablename__ = "routes"
    
    path = Column(String(500), nullable=False, unique=True, index=True) # e.g. "/about" or "/blog/hello-world"
    
    # Polymorphic target (what this route actually renders)
    entity_type = Column(String(100), nullable=False) # e.g. "cms_page", "cms_entry", "landing_page"
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True) # The ID of the target
    
    # Optional Template override (if resolving a CMS Entry that needs a specific wrapper)
    template_id = Column(UUID(as_uuid=True), nullable=True)
    
    is_active = Column(Boolean, default=True)
    locale = Column(String(10), default="en")

class Redirect(EnterpriseMixin, Base):
    __tablename__ = "redirects"
    
    source_path = Column(String(500), nullable=False, unique=True, index=True)
    destination_path = Column(String(500), nullable=False)
    status_code = Column(Integer, default=301) # 301 (Permanent) or 302 (Temporary)
    is_active = Column(Boolean, default=True)

class NavigationMenu(EnterpriseMixin, Base):
    __tablename__ = "navigation_menus"
    
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True) # e.g. "main-header", "footer-legal"
    
    items = relationship("NavigationItem", back_populates="menu", cascade="all, delete-orphan", order_by="NavigationItem.order")

class NavigationItem(EnterpriseMixin, Base):
    __tablename__ = "navigation_items"
    
    menu_id = Column(UUID(as_uuid=True), ForeignKey("navigation_menus.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("navigation_items.id", ondelete="CASCADE"), nullable=True, index=True)
    
    label = Column(String(255), nullable=False)
    url = Column(String(500), nullable=True) # Static URL override
    route_id = Column(UUID(as_uuid=True), ForeignKey("routes.id"), nullable=True, index=True) # Dynamic link to Route
    
    order = Column(Integer, default=0)
    open_in_new_tab = Column(Boolean, default=False)
    icon = Column(String(100), nullable=True)
    
    menu = relationship("NavigationMenu", back_populates="items")
    children = relationship("NavigationItem", backref="parent", remote_side="NavigationItem.id", order_by="NavigationItem.order")

class SEOMetadata(EnterpriseMixin, Base):
    """Polymorphically attaches SEO data to Routes or specific CMS Entities"""
    __tablename__ = "seo_metadata"
    
    entity_type = Column(String(100), nullable=False) # e.g. "route", "cms_page", "cms_entry"
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    title = Column(String(255), nullable=True)
    description = Column(String(1000), nullable=True)
    canonical_url = Column(String(500), nullable=True)
    
    # Open Graph
    og_title = Column(String(255), nullable=True)
    og_description = Column(String(1000), nullable=True)
    og_image_url = Column(String(500), nullable=True)
    
    # Robots & indexing
    noindex = Column(Boolean, default=False)
    nofollow = Column(Boolean, default=False)
    
    # Advanced Schema.org / JSON-LD
    json_ld = Column(JSON, nullable=True)

class DomainBinding(EnterpriseMixin, Base):
    """Maps custom domains/subdomains to specific Tenants/Workspaces."""
    __tablename__ = "domain_bindings"
    
    domain = Column(String(255), nullable=False, unique=True, index=True) # e.g. "tenant.skillsutra.com" or "www.customdomain.com"
    is_primary = Column(Boolean, default=False)
    
    # SSL verification status
    ssl_status = Column(String(50), default="pending")
    
    # Overrides for specific domains (e.g., regional domains .fr vs .de)
    locale_override = Column(String(10), nullable=True)
    
class SlugHistory(EnterpriseMixin, Base):
    """Tracks old slugs to automatically generate 301 redirects if a slug changes."""
    __tablename__ = "slug_history"
    
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    old_slug = Column(String(500), nullable=False, index=True)
    new_slug = Column(String(500), nullable=False)

class PreviewToken(EnterpriseMixin, Base):
    """Secure, time-bound tokens for viewing Draft content before publishing."""
    __tablename__ = "preview_tokens"
    
    token = Column(String(255), nullable=False, unique=True, index=True)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    
    expires_at = Column(String(100), nullable=False) # ISO datetime string
    is_used = Column(Boolean, default=False)

class PublishJob(EnterpriseMixin, Base):
    """Tracks background tasks for static site generation or cache invalidation."""
    __tablename__ = "publish_jobs"
    
    entity_type = Column(String(100), nullable=False, index=True)
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    status = Column(String(50), default="pending") # pending, processing, completed, failed
    error_log = Column(Text, nullable=True)
    
class SitemapConfig(EnterpriseMixin, Base):
    """Manages sitemap.xml dynamically per domain."""
    __tablename__ = "sitemap_configs"
    
    domain_id = Column(UUID(as_uuid=True), ForeignKey("domain_bindings.id"), nullable=True, index=True)
    
    includes_pages = Column(Boolean, default=True)
    includes_blog = Column(Boolean, default=True)
    includes_jobs = Column(Boolean, default=True)
    
    custom_xml = Column(Text, nullable=True)

class RobotsRule(EnterpriseMixin, Base):
    """Manages robots.txt dynamically per domain."""
    __tablename__ = "robots_rules"
    
    domain_id = Column(UUID(as_uuid=True), ForeignKey("domain_bindings.id"), nullable=True, index=True)
    
    user_agent = Column(String(255), default="*")
    allow_paths = Column(JSON, default=list)
    disallow_paths = Column(JSON, default=list)
    crawl_delay = Column(Integer, nullable=True)

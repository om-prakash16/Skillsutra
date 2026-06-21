from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, UUID4

from database.core import get_db
from models.delivery import Route, Redirect, NavigationMenu, NavigationItem, SEOMetadata
from core.response import success_response, paginated_response

admin_delivery_router = APIRouter(prefix="/admin/delivery", tags=["Super Admin Routing & Delivery"])

# Pydantic Schemas
class RouteCreate(BaseModel):
    path: str
    entity_type: str
    entity_id: UUID4
    template_id: Optional[UUID4] = None
    is_active: bool = True
    locale: str = "en"

class RouteUpdate(BaseModel):
    path: Optional[str] = None
    is_active: Optional[bool] = None
    locale: Optional[str] = None

class RedirectCreate(BaseModel):
    source_path: str
    destination_path: str
    status_code: int = 301
    is_active: bool = True

@admin_delivery_router.get("/routes")
async def list_routes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Dependency check for require_super_admin goes here
    total = db.query(Route).count()
    routes = db.query(Route).offset(skip).limit(limit).all()
    data = [{"id": r.id, "path": r.path, "entity_type": r.entity_type, "is_active": r.is_active} for r in routes]
    return paginated_response(data=data, total=total, page=skip//limit + 1 if limit else 1, size=limit)

@admin_delivery_router.post("/routes")
async def create_route(route: RouteCreate, db: Session = Depends(get_db)):
    existing = db.query(Route).filter(Route.path == route.path).first()
    if existing:
        raise HTTPException(status_code=400, detail="Path already exists")
        
    db_route = Route(**route.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return success_response(data={"id": db_route.id, "path": db_route.path}, status_code=201)

@admin_delivery_router.patch("/routes/{route_id}")
async def update_route(route_id: str, payload: RouteUpdate, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
        
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(route, key, value)
        
    db.commit()
    return success_response(message="Route updated successfully")

@admin_delivery_router.get("/redirects")
async def list_redirects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total = db.query(Redirect).count()
    redirects = db.query(Redirect).offset(skip).limit(limit).all()
    data = [{"id": r.id, "source": r.source_path, "destination": r.destination_path, "status": r.status_code} for r in redirects]
    return paginated_response(data=data, total=total, page=skip//limit + 1 if limit else 1, size=limit)

@admin_delivery_router.post("/redirects")
async def create_redirect(redirect: RedirectCreate, db: Session = Depends(get_db)):
    db_redirect = Redirect(**redirect.dict())
    db.add(db_redirect)
    db.commit()
    db.refresh(db_redirect)
    return success_response(data={"id": db_redirect.id}, status_code=201)

@admin_delivery_router.delete("/redirects/{redirect_id}")
async def delete_redirect(redirect_id: str, db: Session = Depends(get_db)):
    redirect = db.query(Redirect).filter(Redirect.id == redirect_id).first()
    if not redirect:
        raise HTTPException(status_code=404, detail="Redirect not found")
    db.delete(redirect)
    db.commit()
    return success_response(message="Redirect deleted successfully")

from models.delivery import DomainBinding

class DomainBindingCreate(BaseModel):
    domain: str
    is_primary: bool = False
    locale_override: Optional[str] = None

class NavigationMenuCreate(BaseModel):
    name: str
    slug: str

class SEOMetadataCreate(BaseModel):
    entity_type: str
    entity_id: UUID4

from models.delivery import DomainBinding

class DomainBindingCreate(BaseModel):
    domain: str
    is_primary: bool = False
    locale_override: Optional[str] = None

class NavigationMenuCreate(BaseModel):
    name: str
    slug: str

class SEOMetadataCreate(BaseModel):
    entity_type: str
    entity_id: UUID4
    title: Optional[str] = None
    description: Optional[str] = None
    canonical_url: Optional[str] = None
    noindex: bool = False
    nofollow: bool = False

@admin_delivery_router.get("/domains")
async def list_domains(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total = db.query(DomainBinding).count()
    domains = db.query(DomainBinding).offset(skip).limit(limit).all()
    data = [{"id": d.id, "domain": d.domain, "is_primary": d.is_primary, "ssl_status": d.ssl_status} for d in domains]
    return paginated_response(data=data, total=total, page=skip//limit + 1 if limit else 1, size=limit)

@admin_delivery_router.post("/domains")
async def create_domain(domain: DomainBindingCreate, db: Session = Depends(get_db)):
    db_domain = DomainBinding(**domain.dict())
    db.add(db_domain)
    db.commit()
    db.refresh(db_domain)
    return success_response(data={"id": db_domain.id}, status_code=201)

@admin_delivery_router.get("/navigation")
async def list_navigation_menus(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    total = db.query(NavigationMenu).count()
    menus = db.query(NavigationMenu).offset(skip).limit(limit).all()
    data = [{"id": m.id, "name": m.name, "slug": m.slug} for m in menus]
    return paginated_response(data=data, total=total, page=skip//limit + 1 if limit else 1, size=limit)

@admin_delivery_router.post("/navigation")
async def create_navigation_menu(menu: NavigationMenuCreate, db: Session = Depends(get_db)):
    db_menu = NavigationMenu(**menu.dict())
    db.add(db_menu)
    db.commit()
    db.refresh(db_menu)
    return success_response(data={"id": db_menu.id}, status_code=201)

@admin_delivery_router.get("/seo/{entity_type}/{entity_id}")
async def get_seo(entity_type: str, entity_id: str, db: Session = Depends(get_db)):
    seo = db.query(SEOMetadata).filter(SEOMetadata.entity_type == entity_type, SEOMetadata.entity_id == entity_id).first()
    if not seo:
        raise HTTPException(status_code=404, detail="SEO metadata not found")
    return success_response(data={"title": seo.title, "description": seo.description, "canonical_url": seo.canonical_url})

@admin_delivery_router.post("/seo")
async def create_seo(seo: SEOMetadataCreate, db: Session = Depends(get_db)):
    db_seo = SEOMetadata(**seo.dict())
    db.add(db_seo)
    db.commit()
    db.refresh(db_seo)
    return success_response(data={"id": db_seo.id}, status_code=201)

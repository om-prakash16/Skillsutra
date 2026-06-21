append_code = """
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
    domains = db.query(DomainBinding).offset(skip).limit(limit).all()
    return {"success": True, "data": [{"id": d.id, "domain": d.domain, "is_primary": d.is_primary, "ssl_status": d.ssl_status} for d in domains]}

@admin_delivery_router.post("/domains")
async def create_domain(domain: DomainBindingCreate, db: Session = Depends(get_db)):
    db_domain = DomainBinding(**domain.dict())
    db.add(db_domain)
    db.commit()
    db.refresh(db_domain)
    return {"success": True, "data": {"id": db_domain.id}}

@admin_delivery_router.get("/navigation")
async def list_navigation_menus(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    menus = db.query(NavigationMenu).offset(skip).limit(limit).all()
    return {"success": True, "data": [{"id": m.id, "name": m.name, "slug": m.slug} for m in menus]}

@admin_delivery_router.post("/navigation")
async def create_navigation_menu(menu: NavigationMenuCreate, db: Session = Depends(get_db)):
    db_menu = NavigationMenu(**menu.dict())
    db.add(db_menu)
    db.commit()
    db.refresh(db_menu)
    return {"success": True, "data": {"id": db_menu.id}}

@admin_delivery_router.get("/seo/{entity_type}/{entity_id}")
async def get_seo(entity_type: str, entity_id: str, db: Session = Depends(get_db)):
    seo = db.query(SEOMetadata).filter(SEOMetadata.entity_type == entity_type, SEOMetadata.entity_id == entity_id).first()
    if not seo:
        raise HTTPException(status_code=404, detail="SEO metadata not found")
    return {"success": True, "data": {"title": seo.title, "description": seo.description, "canonical_url": seo.canonical_url}}

@admin_delivery_router.post("/seo")
async def create_seo(seo: SEOMetadataCreate, db: Session = Depends(get_db)):
    db_seo = SEOMetadata(**seo.dict())
    db.add(db_seo)
    db.commit()
    db.refresh(db_seo)
    return {"success": True, "data": {"id": db_seo.id}}
"""

with open('e:/Project/Ram/server/modules/delivery/admin_router.py', 'a', encoding='utf-8') as f:
    f.write(append_code)

print("Appended APIs successfully.")

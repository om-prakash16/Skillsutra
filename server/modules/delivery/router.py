from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from database.core import get_db
from models.delivery import Route, Redirect, SEOMetadata
from models.cms import CMSPage, CMSEntry

router = APIRouter()

@router.get("/resolve", tags=["Delivery Engine"])
async def resolve_path(path: str = Query(...), db: Session = Depends(get_db)):
    """
    The core of the Headless routing engine.
    Given a URL path (e.g. '/about' or '/blog/my-post'), this endpoint resolves what to render.
    """
    # 1. Check for Redirects first
    redirect = db.query(Redirect).filter(Redirect.source_path == path, Redirect.is_active == True).first()
    if redirect:
        return {
            "success": True,
            "data": {
                "action": "redirect",
                "destination": redirect.destination_path,
                "status_code": redirect.status_code
            }
        }
        
    # 2. Find the Route
    route = db.query(Route).filter(Route.path == path, Route.is_active == True).first()
    if not route:
        return {"success": False, "error": "NOT_FOUND", "message": "No route mapped to this path"}, 404
        
    # 3. Retrieve SEO Metadata
    seo = db.query(SEOMetadata).filter(
        SEOMetadata.entity_type == "route",
        SEOMetadata.entity_id == route.id
    ).first()
    
    seo_payload = {}
    if seo:
        seo_payload = {
            "title": seo.title,
            "description": seo.description,
            "canonical": seo.canonical_url,
            "og_title": seo.og_title,
            "og_image": seo.og_image_url
        }
        
    # 4. Resolve Entity Payload (What are we rendering?)
    render_payload = None
    
    if route.entity_type == "cms_page":
        page = db.query(CMSPage).filter(CMSPage.id == route.entity_id).first()
        if page:
            render_payload = page.component_tree
            
    elif route.entity_type == "cms_entry":
        # Dynamic entries (e.g., a specific Job or Blog Post)
        # In a full system, this would fetch the entry data and merge it into the associated `template_id` layout.
        entry = db.query(CMSEntry).filter(CMSEntry.id == route.entity_id).first()
        if entry:
            # Mocking the template wrapper resolution for now
            render_payload = {
                "id": "root",
                "type": "div",
                "props": {"className": "p-8 max-w-4xl mx-auto"},
                "children": [
                    {
                        "id": "title",
                        "type": "h1",
                        "props": {"className": "text-4xl font-bold mb-4"},
                        "content": entry.data.get("title", "Dynamic Entry") if entry.data else "Dynamic Entry"
                    },
                    {
                        "id": "content",
                        "type": "p",
                        "props": {"className": "text-lg text-gray-700"},
                        "content": str(entry.data)
                    }
                ]
            }
            
    if not render_payload:
        return {"success": False, "error": "BROKEN_LINK", "message": "Route exists but target entity is missing"}, 500
        
    return {
        "success": True,
        "data": {
            "action": "render",
            "seo": seo_payload,
            "component_tree": render_payload
        }
    }

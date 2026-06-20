from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.core import get_db
from models.design import Theme, ThemeToken, GlobalStyle
from typing import List, Dict

router = APIRouter()

@router.get("/themes", tags=["Design System"])
async def get_themes(db: Session = Depends(get_db)):
    """Fetch all available themes."""
    themes = db.query(Theme).all()
    return {"success": True, "data": [{"id": t.id, "name": t.name, "is_dark": t.is_dark, "is_default": t.is_default} for t in themes]}

@router.get("/themes/{theme_id}/tokens", tags=["Design System"])
async def get_theme_tokens(theme_id: str, db: Session = Depends(get_db)):
    """Fetch design tokens for a specific theme."""
    tokens = db.query(ThemeToken).filter(ThemeToken.theme_id == theme_id).all()
    if not tokens:
        # Generate some default tokens if none exist (for milestone 7 testing)
        default_tokens = [
            ThemeToken(theme_id=theme_id, name="primary", category="colors", value="#0ea5e9", tenant_id="system", created_by="system"),
            ThemeToken(theme_id=theme_id, name="primary-foreground", category="colors", value="#ffffff", tenant_id="system", created_by="system"),
            ThemeToken(theme_id=theme_id, name="background", category="colors", value="#ffffff", tenant_id="system", created_by="system"),
            ThemeToken(theme_id=theme_id, name="foreground", category="colors", value="#0f172a", tenant_id="system", created_by="system"),
            ThemeToken(theme_id=theme_id, name="card", category="colors", value="#ffffff", tenant_id="system", created_by="system"),
            ThemeToken(theme_id=theme_id, name="card-foreground", category="colors", value="#0f172a", tenant_id="system", created_by="system"),
            ThemeToken(theme_id=theme_id, name="radius-md", category="radius", value="0.5rem", tenant_id="system", created_by="system"),
            ThemeToken(theme_id=theme_id, name="font-sans", category="typography", value="Inter, sans-serif", tenant_id="system", created_by="system"),
        ]
        db.add_all(default_tokens)
        db.commit()
        tokens = default_tokens

    # Format tokens into a flat dictionary for the CSS Engine
    token_dict = {f"--{t.name}": t.value for t in tokens}
    
    return {"success": True, "data": token_dict}

@router.get("/global-styles", tags=["Design System"])
async def get_global_styles(db: Session = Depends(get_db)):
    """Fetch global styles mapped by component type."""
    styles = db.query(GlobalStyle).all()
    return {"success": True, "data": [{"id": s.id, "name": s.name, "component_type": s.component_type, "style_props": s.style_props} for s in styles]}

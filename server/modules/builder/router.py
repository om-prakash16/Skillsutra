from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from core.database import get_db_session as get_db
from models.builder import BuilderPage, Site
from .schemas import BuilderPageResponse, BuilderPageCreate, BuilderPageUpdate, BuilderSiteResponse, BuilderSiteCreate

router = APIRouter()

@router.get("/sites", response_model=List[BuilderSiteResponse])
async def list_sites(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Site))
    return result.scalars().all()

@router.post("/sites", response_model=BuilderSiteResponse, status_code=status.HTTP_201_CREATED)
async def create_site(site: BuilderSiteCreate, db: AsyncSession = Depends(get_db)):
    db_site = Site(**site.model_dump())
    db.add(db_site)
    await db.commit()
    await db.refresh(db_site)
    return db_site

@router.get("/pages", response_model=List[BuilderPageResponse])
async def list_pages(site_id: UUID = None, db: AsyncSession = Depends(get_db)):
    # Auto-create a default site if none exist to make testing easier
    site_result = await db.execute(select(Site))
    first_site = site_result.scalars().first()
    if not first_site:
        first_site = Site(name="Default Site", domain="localhost")
        db.add(first_site)
        await db.commit()
        await db.refresh(first_site)

    query = select(BuilderPage)
    if site_id:
        query = query.where(BuilderPage.site_id == site_id)
    else:
        query = query.where(BuilderPage.site_id == first_site.id)

    result = await db.execute(query)
    return result.scalars().all()

@router.post("/pages", response_model=BuilderPageResponse, status_code=status.HTTP_201_CREATED)
async def create_page(page: BuilderPageCreate, db: AsyncSession = Depends(get_db)):
    db_page = BuilderPage(**page.model_dump())
    db.add(db_page)
    await db.commit()
    await db.refresh(db_page)
    return db_page

@router.get("/pages/slug/{slug}", response_model=BuilderPageResponse)
async def get_page_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BuilderPage).where(BuilderPage.slug == slug))
    db_page = result.scalars().first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page

@router.get("/pages/{page_id}", response_model=BuilderPageResponse)
async def get_page(page_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BuilderPage).where(BuilderPage.id == page_id))
    db_page = result.scalars().first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page

@router.put("/pages/{page_id}", response_model=BuilderPageResponse)
async def update_page(page_id: UUID, page_update: BuilderPageUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BuilderPage).where(BuilderPage.id == page_id))
    db_page = result.scalars().first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    update_data = page_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_page, key, value)
        
    await db.commit()
    await db.refresh(db_page)
    return db_page

@router.delete("/pages/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_page(page_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BuilderPage).where(BuilderPage.id == page_id))
    db_page = result.scalars().first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    await db.delete(db_page)
    await db.commit()
    return None

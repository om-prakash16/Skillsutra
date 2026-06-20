from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from core.database import get_db_session
from models.navigation import NavigationModule

router = APIRouter(prefix="/navigation", tags=["Navigation"])

@router.get("/sidebar")
async def get_sidebar_navigation(
    db: AsyncSession = Depends(get_db_session)
):
    """
    Fetches the dynamic, 3-level permission-aware navigation tree for the current user.
    """
    # Fetch all modules with subgroups and links eager loaded
    stmt = (
        select(NavigationModule)
        .options(
            selectinload(NavigationModule.subgroups).selectinload(NavigationModule.links),
            selectinload(NavigationModule.links)
        )
        .order_by(NavigationModule.order_index)
    )
    
    result = await db.execute(stmt)
    modules = result.scalars().all()
    
    # Construct JSON response
    nav_tree = []
    
    for module in modules:
        mod_dict = {
            "id": str(module.id),
            "label": module.label,
            "icon": module.icon,
            "required_role": module.required_role,
            "subGroups": [],
            "links": []
        }
        
        # Add SubGroups
        for sub in sorted(module.subgroups, key=lambda x: x.order_index):
            sub_dict = {
                "id": str(sub.id),
                "label": sub.label,
                "required_role": sub.required_role,
                "links": [
                    {
                        "id": str(link.id),
                        "label": link.label,
                        "href": link.href,
                        "icon": link.icon,
                        "exact": link.exact,
                        "required_role": link.required_role
                    } for link in sorted(sub.links, key=lambda l: l.order_index)
                ]
            }
            mod_dict["subGroups"].append(sub_dict)
            
        # Add Direct Links
        for link in sorted(module.links, key=lambda x: x.order_index):
            mod_dict["links"].append({
                "id": str(link.id),
                "label": link.label,
                "href": link.href,
                "icon": link.icon,
                "exact": link.exact,
                "required_role": link.required_role
            })
            
        nav_tree.append(mod_dict)

    return nav_tree

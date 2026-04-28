from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID
from modules.auth.core.guards import require_company
from modules.talent_pool.schemas import SaveTalentRequest
from modules.talent_pool.service import TalentPoolService

router = APIRouter()
talent_pool_service = TalentPoolService()

@router.post("/{company_id}/save")
async def save_talent(company_id: UUID, req: SaveTalentRequest, user=Depends(require_company)):
    """
    Save a talent for future job roles.
    """
    user_id = UUID(user.get("sub"))
    try:
        data = await talent_pool_service.save_talent(company_id, req.talent_id, user_id, req.notes)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{company_id}/unsave/{talent_id}")
async def unsave_talent(company_id: UUID, talent_id: UUID, user=Depends(require_company)):
    """
    Remove a talent from the company's saved talent pool.
    """
    try:
        success = await talent_pool_service.remove_saved_talent(company_id, talent_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to remove talent")
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{company_id}/saved")
async def get_saved_talent(company_id: UUID, user=Depends(require_company)):
    """
    Fetch all saved talent for the company.
    """
    try:
        data = await talent_pool_service.get_saved_talent(company_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

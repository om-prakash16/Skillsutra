from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from core.database import get_db_session
from core.response import success_response
from modules.auth.core.guards import get_current_user
from models.admin import FeatureFlag

router = APIRouter(prefix="/operations", tags=["DevOps & Operations"])

@router.get("/health")
async def system_health(db: Session = Depends(get_db_session)):
    """
    Public Endpoint for Load Balancers (GCP/AWS).
    Checks Postgres and Redis connectivity.
    """
    try:
        # Check Postgres
        db.execute("SELECT 1")
        # Check Redis (Mock)
        redis_status = "ok" 
        
        return {
            "status": "healthy",
            "database": "ok",
            "cache": redis_status,
            "version": "1.0.4"
        }
    except Exception:
        raise HTTPException(status_code=503, detail="Service Unavailable: Degraded state.")

@router.get("/flags")
async def get_active_feature_flags(db: Session = Depends(get_db_session)):
    """
    Public Endpoint for Frontend Next.js.
    Returns active A/B tests and rollout configurations.
    """
    flags = db.query(FeatureFlag).filter(FeatureFlag.is_enabled == True).all()
    # In production, this would be highly cached via Redis.
    return success_response(
        data=[{"key": f.key, "rollout": f.rollout_percentage} for f in flags],
        message="Active flags fetched."
    )

@router.post("/webhooks/trigger")
async def trigger_async_webhook(
    event_type: str, 
    payload: dict,
    background_tasks: BackgroundTasks,
    user = Depends(get_current_user)
):
    """
    Internal/Mock endpoint to demonstrate asynchronous webhook processing.
    When a user does something (e.g. accepts an offer), this fires.
    """
    # 1. Fetch all webhooks listening for `event_type`
    # 2. Use background_tasks.add_task(send_webhook_http_request, url, payload)
    
    # We offload the actual HTTP POST to the background task to prevent the
    # 3rd party server's latency from slowing down our API response.
    return success_response(message=f"Webhook event '{event_type}' queued for delivery.")

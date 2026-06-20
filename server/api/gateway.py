from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import logging

from core.database import get_db_session as get_db
from api.v1.router import v1_router

logger = logging.getLogger(__name__)

# The Master API Gateway Router
gateway_router = APIRouter()

async def verify_api_key(request: Request, db: Session = Depends(get_db)):
    """
    Middleware/Dependency for the API Gateway.
    Authenticates external B2B partners via Authorization: Bearer <API_KEY>.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer sk_live_"):
        raise HTTPException(status_code=401, detail="Missing or invalid API Key. Format: Bearer sk_live_...")
    
    # Extract key
    raw_key = auth_header.replace("Bearer ", "")
    
    # In production, we would hash the `raw_key` and look it up in the database.
    # We would also check Redis to see if this API key has exceeded its rate limit (e.g. 1000 req/min)
    # For now, we simulate a successful gateway pass.
    
    logger.info("API GATEWAY: Validated incoming external request.")
    return True

# -----------------------------------------------------------------------------
# API VERSIONING
# -----------------------------------------------------------------------------

# Mount the entire Internal App v1 Router (from server/api/v1/router.py)
# This is used by the Next.js frontend (Cookie/JWT authenticated)
gateway_router.include_router(v1_router, prefix="/v1")


# Create a separate B2B External Router
# This is used by 3rd party partners (API Key authenticated)
b2b_v1_router = APIRouter(prefix="/v1/external", dependencies=[Depends(verify_api_key)])

@b2b_v1_router.get("/candidates")
async def fetch_candidates(db: Session = Depends(get_db)):
    """
    External API Gateway endpoint for partners (like Greenhouse ATS)
    to sync candidate data.
    """
    return {
        "status": "success",
        "data": [
            {"id": "c1", "name": "John Doe", "match_score": 92.5},
            {"id": "c2", "name": "Sarah Smith", "match_score": 88.0}
        ]
    }

# Mount the external API to the gateway
gateway_router.include_router(b2b_v1_router)

import time
from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from core.database import get_db_session
from core.api_standard import ApiResponse
from models.operations import HealthCheckLog

router = APIRouter(tags=["Platform Operations"])

@router.get("/health", response_model=ApiResponse)
async def health_check(response: Response, db: AsyncSession = Depends(get_db_session)):
    """
    Deep Health Probe. Checks Database, Redis, and overall system status.
    Used by Kubernetes or Load Balancers to determine traffic routing.
    """
    status = "healthy"
    details = {}
    
    # Check Database
    start_time = time.time()
    try:
        await db.execute(text("SELECT 1"))
        db_latency = int((time.time() - start_time) * 1000)
        details["database"] = {"status": "up", "latency_ms": db_latency}
    except Exception as e:
        details["database"] = {"status": "down", "error": str(e)}
        status = "degraded"
        response.status_code = 503

    # Check Redis (Mocked here, assuming a core.redis.get_redis_client exists)
    try:
        from core.redis import get_redis_client
        redis = get_redis_client()
        start_time = time.time()
        await redis.ping()
        redis_latency = int((time.time() - start_time) * 1000)
        details["redis"] = {"status": "up", "latency_ms": redis_latency}
    except Exception as e:
        details["redis"] = {"status": "down", "error": str(e)}
        status = "degraded"
        
    # Log HealthCheck asynchronously (usually you wouldn't log every health ping to the DB,
    # but we do it here as requested by the architecture for auditability).
    if status != "healthy":
        try:
            log = HealthCheckLog(
                service_name="platform",
                status=status,
                details=details
            )
            db.add(log)
            await db.commit()
        except:
            pass # Don't crash health check if logging fails
            
    return ApiResponse(
        success=(status == "healthy"),
        message=f"System is {status}",
        data=details
    )

@router.get("/live")
async def liveness_probe():
    """
    Simple liveness probe. Indicates if the application process is running.
    """
    return {"status": "alive"}

@router.get("/ready")
async def readiness_probe(db: AsyncSession = Depends(get_db_session)):
    """
    Indicates if the application is ready to receive traffic.
    """
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Database not ready")

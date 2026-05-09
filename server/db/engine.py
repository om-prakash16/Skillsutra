from supabase import create_async_client, AsyncClient
from core.config import settings
from core.logging import ProtocolLogger

logger = ProtocolLogger.get_logger("db.engine")

async def get_supabase_client() -> Optional[AsyncClient]:
    """Initializes and returns the asynchronous Supabase client."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.critical("Database configuration missing (SUPABASE_URL/SUPABASE_KEY)")
        return None
        
    try:
        return await create_async_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize async Supabase client: {e}")
        return None

# Placeholder for async initialization in main.py
db_client: Optional[AsyncClient] = None

async def init_db():
    global db_client
    db_client = await get_supabase_client()

def check_db_health() -> bool:
    """Enterprise-grade health check for database connectivity."""
    if not db_client:
        return False
    try:
        # Optimized heartbeat query
        db_client.table("users").select("id").limit(1).execute()
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False

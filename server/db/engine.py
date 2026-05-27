import asyncpg
import logging
from core.config import settings

logger = logging.getLogger(__name__)

pool = None
db_loop = None
db_thread_id = None

async def init_db():
    global pool
    db_url = settings.DATABASE_URL
    # Ensure we use postgresql:// instead of postgresql+asyncpg:// for asyncpg.create_pool
    if db_url.startswith("postgresql+asyncpg://"):
        db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
    
    logger.info("Initializing asyncpg connection pool...")
    pool = await asyncpg.create_pool(db_url, min_size=5, max_size=20)
    logger.info("Database pool initialized successfully.")

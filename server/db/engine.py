import os
import logging
from typing import Optional
import asyncpg
from core.config import settings
from core.logging import ProtocolLogger
from core.postgres_adapter import PostgresAdapter

logger = ProtocolLogger.get_logger("db.engine")

# The global database adapter client instance
db_client: Optional[PostgresAdapter] = None
# The underlying asyncpg connection pool
pool: Optional[asyncpg.Pool] = None
db_loop = None
db_thread_id = None

async def run_migrations():
    """Reads and executes all SQL migrations alphabetically if they haven't been applied yet."""
    global pool
    if not pool:
        logger.error("Pool not available for migrations.")
        return

    logger.info("Checking database schema migrations...")
    async with pool.acquire() as conn:
        # Create migrations tracking table if not exists
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        migrations_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "database", "migrations"))
        if not os.path.exists(migrations_dir):
            # Fallback to absolute paths if path resolution is off
            migrations_dir = "e:/Project/Ram/database/migrations"

        if os.path.exists(migrations_dir):
            files = sorted([f for f in os.listdir(migrations_dir) if f.endswith(".sql")])
            for filename in files:
                # Check if already applied
                exists = await conn.fetchval("SELECT 1 FROM schema_migrations WHERE version = $1", filename)
                if not exists:
                    logger.info(f"Applying migration schema: {filename}")
                    filepath = os.path.join(migrations_dir, filename)
                    with open(filepath, "r", encoding="utf-8") as f:
                        sql_content = f.read()

                    # Run migration in transaction block
                    async with conn.transaction():
                        try:
                            # Note: Execute raw migration SQL
                            await conn.execute(sql_content)
                            await conn.execute("INSERT INTO schema_migrations (version) VALUES ($1)", filename)
                            logger.info(f"Applied migration successfully: {filename}")
                        except Exception as e:
                            logger.error(f"Migration {filename} failed: {e}")
                            raise e
        else:
            logger.warning(f"Migrations folder not found at path: {migrations_dir}")

async def init_db():
    """Initializes the database connection pool and applies migrations."""
    global db_client, pool
    
    # Check for DATABASE_URL or parse standard postgres connection string
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        db_url = "postgresql://postgres:postgres@localhost:5432/skillsutra"
        
    logger.info(f"Connecting to database url: {db_url.split('@')[-1] if '@' in db_url else db_url}")
    
    try:
        import asyncio
        import threading
        global db_client, pool, db_loop, db_thread_id
        pool = await asyncpg.create_pool(db_url)
        db_loop = asyncio.get_running_loop()
        db_thread_id = threading.get_ident()
        db_client = PostgresAdapter()
        logger.info("Local PostgreSQL database connection pool established.")
        
        # Automatically run migration scripts on boot
        await run_migrations()
        
    except Exception as e:
        logger.critical(f"Failed to initialize PostgreSQL pool: {e}")
        pool = None
        db_client = None

async def check_db_health() -> bool:
    """Checks if the connection pool is alive and database can query."""
    if not pool:
        return False
    try:
        async with pool.acquire() as conn:
            await conn.execute("SELECT 1")
            return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False

import os
import logging
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

logger = logging.getLogger(__name__)

# SQLAlchemy Base for ORM models
Base = declarative_base()

# SQLAlchemy Async Engine
db_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@127.0.0.1:5433/skillsutra")
# Ensure the connection string uses asyncpg for sqlalchemy
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    db_url, 
    echo=False, 
    future=True,
    pool_size=int(os.getenv("DATABASE_POOL_SIZE", "5")),
    max_overflow=int(os.getenv("DATABASE_MAX_OVERFLOW", "10")),
    pool_timeout=30,
    pool_pre_ping=True
)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db_session():
    """Dependency for injecting SQLAlchemy sessions into FastAPI routes."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()

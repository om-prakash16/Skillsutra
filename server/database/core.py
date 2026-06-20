import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Re-export Base from the core so all models use the same metadata
from core.database import Base

logger = logging.getLogger(__name__)

db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@ram-db:5432/skillsutra")
if db_url.startswith("postgresql+asyncpg://"):
    db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
elif db_url.startswith("postgresql://") and "asyncpg" not in db_url:
    pass
else:
    db_url = "postgresql://postgres:postgres@ram-db:5432/skillsutra"

engine = create_engine(db_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

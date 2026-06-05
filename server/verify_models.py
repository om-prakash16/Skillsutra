import asyncio
import sys
import os

# Add server to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from core.database import Base
from dotenv import load_dotenv

load_dotenv(".env")

# Import all models to ensure they are registered with Base.metadata
import models.core
import models.user
import models.profile
import models.oauth
import models.security
import models.session
import models.recovery
import models.gamification
import models.social
import models.notifications
import models.identity
import models.skills
import models.taxonomy
import models.resume
import models.assessments
import models.ats
import models.recruiter
import models.cover_letter
import models.community
import models.learning
import models.ecosystem
import models.ultimate_ecosystem

# Adjust DATABASE_URL to hit localhost port 5433 instead of hiring-tool-db container if running locally
db_url = os.getenv("DATABASE_URL")
if db_url and "hiring-tool-db:5432" in db_url:
    db_url = db_url.replace("hiring-tool-db:5432", "localhost:5433")
elif not db_url:
    db_url = "postgresql+asyncpg://postgres:postgres@localhost:5433/skillsutra"
    
# Make sure to use asyncpg driver
if "postgresql://" in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

print(f"Connecting to {db_url}...")

engine = create_async_engine(db_url)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def test_models():
    errors = []
    async with async_session() as session:
        print(f"Testing {len(Base.metadata.tables)} models...")
        for table_name, table in Base.metadata.tables.items():
            # Get the model class corresponding to the table
            model_class = next((c for c in Base.registry._class_registry.values() if hasattr(c, '__table__') and c.__table__ == table), None)
            if model_class:
                try:
                    stmt = select(model_class).limit(1)
                    await session.execute(stmt)
                    print(f"[OK] {table_name}")
                except Exception as e:
                    errors.append((table_name, str(e)))
                    print(f"[FAIL] {table_name}")
                    await session.rollback()
    
    if errors:
        print("\n--- ERRORS FOUND ---")
        for table, err in errors:
            print(f"Table {table}: {err}")
    else:
        print("\nAll models perfectly match the database schema!")

if __name__ == "__main__":
    asyncio.run(test_models())

import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import engine, Base
from sqlalchemy import text
import models.security
import models.session
import scripts.init_db # Ensure all models are imported and registered in SQLAlchemy Base

async def run_migrations():
    async with engine.begin() as conn:
        print("Adding columns to sessions table if they don't exist...")
        try:
            await conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_id VARCHAR;"))
            await conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_info VARCHAR;"))
            await conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS browser VARCHAR;"))
            await conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS os VARCHAR;"))
            await conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS country VARCHAR;"))
            await conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS city VARCHAR;"))
            await conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS login_method VARCHAR;"))
            await conn.execute(text("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;"))
            print("Successfully added columns to sessions table.")
        except Exception as e:
            print(f"Error adding columns to sessions table: {e}")
        
        print("Creating new security tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created.")

if __name__ == "__main__":
    asyncio.run(run_migrations())

import asyncio
import os
import sys
from sqlalchemy import text

# Add the server root to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import engine

async def run_migration():
    migration_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "db", "search_indexes.sql")
    
    if not os.path.exists(migration_file):
        print(f"Migration file not found: {migration_file}")
        return
        
    with open(migration_file, "r") as f:
        sql = f.read()

    print("Running search indexes migration...")
    try:
        async with engine.begin() as conn:
            # Split by semicolon and execute individually for asyncpg
            statements = [s.strip() for s in sql.split(';') if s.strip()]
            for statement in statements:
                print(f"Executing: {statement[:50]}...")
                await conn.execute(text(statement))
        print("Migration successful!")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migration())

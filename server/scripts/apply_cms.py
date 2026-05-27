import asyncio
import os
import sys

# Add the server directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import engine
from core.postgres_adapter import logger

async def run_sql(filepath: str):
    await engine.init_db()
    with open(filepath, "r", encoding="utf-8") as f:
        sql = f.read()
    
    async with engine.pool.acquire() as conn:
        print(f"Executing {filepath}...")
        await conn.execute(sql)
        print("Success!")

if __name__ == "__main__":
    filepath = r"e:\Project\Ram\database\migrations\28_cms_landing_remaining.sql"
    asyncio.run(run_sql(filepath))

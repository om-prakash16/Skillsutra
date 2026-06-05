import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import engine

async def run_migration():
    await engine.init_db()
    filepath = "/app/scripts/54_blog_system.sql"
    with open(filepath, "r", encoding="utf-8") as f:
        sql = f.read()
    
    async with engine.pool.acquire() as conn:
        print(f"Executing {filepath}...")
        await conn.execute(sql)
        print("Success!")

if __name__ == "__main__":
    asyncio.run(run_migration())

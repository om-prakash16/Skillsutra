import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import engine

async def main():
    await engine.init_db()
    async with engine.pool.acquire() as conn:
        res = await conn.fetch("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        print("All tables:")
        print([r['table_name'] for r in res])

asyncio.run(main())

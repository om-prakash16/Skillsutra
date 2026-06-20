import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import engine
from sqlalchemy import text

async def get_admin():
    async with engine.begin() as conn:
        res = await conn.execute(text("SELECT email, username, role FROM users WHERE role IN ('admin', 'super_admin', 'SUPER_ADMIN')"))
        rows = res.fetchall()
        print("Admins found:")
        for r in rows:
            print(f"- Email: {r[0]}, Username: {r[1]}, Role: {r[2]}")

if __name__ == "__main__":
    asyncio.run(get_admin())

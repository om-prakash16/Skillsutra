import asyncio
import sys
import os

# Ensure the server root is in path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.database import AsyncSessionLocal
from models.user import User
from sqlalchemy import select
from core.security import get_password_hash

async def fix_pwd():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == "testuser@skillsutra.com"))
        user = result.scalars().first()
        if user:
            user.hashed_password = get_password_hash("Password123!")
            await db.commit()
            print("Password updated successfully!")
        else:
            print("User not found!")

if __name__ == "__main__":
    asyncio.run(fix_pwd())

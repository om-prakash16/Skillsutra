"""Fix the test user password using bcrypt directly instead of passlib."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bcrypt
from core.database import AsyncSessionLocal
from models.user import User
from sqlalchemy import select

async def fix_pwd():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == "testuser@skillsutra.com"))
        user = result.scalars().first()
        if user:
            # Hash directly with bcrypt to avoid passlib compatibility issues
            hashed = bcrypt.hashpw("Password123!".encode("utf-8"), bcrypt.gensalt())
            user.hashed_password = hashed.decode("utf-8")
            await db.commit()
            print(f"Password updated successfully for {user.email}!")
            print(f"New hash: {user.hashed_password[:20]}...")
        else:
            print("User not found!")

if __name__ == "__main__":
    asyncio.run(fix_pwd())

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
        # Use raw SQL to avoid ORM schema mismatch errors (e.g. missing columns like wallet_address)
        from sqlalchemy import text
        result = await db.execute(text("SELECT id, email FROM users WHERE email = 'testuser@skillsutra.com'"))
        user = result.fetchone()
        
        if user:
            hashed = bcrypt.hashpw("Password123!".encode("utf-8"), bcrypt.gensalt(4))
            hashed_str = hashed.decode("utf-8")
            await db.execute(
                text("UPDATE users SET hashed_password = :h WHERE email = 'testuser@skillsutra.com'"),
                {"h": hashed_str}
            )
            await db.commit()
            print(f"Password updated successfully for {user.email}!")
            print(f"New hash: {hashed_str[:20]}...")
        else:
            print("User not found!")

if __name__ == "__main__":
    asyncio.run(fix_pwd())

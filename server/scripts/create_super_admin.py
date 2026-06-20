import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import AsyncSessionLocal
from models.user import User
from models.core import Role
from core.security import get_password_hash
from sqlalchemy import select
from sqlalchemy.orm import selectinload

async def create_super_admin():
    async with AsyncSessionLocal() as db:
        admin_email = "prakash.om.global@gmail.com"
        admin_password = "AdminPassword123!"
        admin_username = "prakashom"

        # Check if exists
        res = await db.execute(select(User).options(selectinload(User.roles)).where(User.email == admin_email))
        user = res.scalars().first()

        if user:
            print("Admin user already exists. Updating password and role...")
            user.password_hash = await get_password_hash(admin_password)
        else:
            print("Creating new admin user...")
            user = User(
                email=admin_email,
                username=admin_username,
                password_hash=await get_password_hash(admin_password),
                is_active=True
            )
            # Initialize empty list to prevent lazy load on new object
            user.roles = []
            db.add(user)
            await db.flush()

        # Fetch or create roles
        for role_name in ["super_admin", "admin", "SUPER_ADMIN", "ADMIN"]:
            role_res = await db.execute(select(Role).where(Role.role_name == role_name))
            role = role_res.scalars().first()
            if not role:
                role = Role(role_name=role_name, description=f"{role_name} Role")
                db.add(role)
                await db.flush()
            
            if role not in user.roles:
                user.roles.append(role)
        
        await db.commit()
        print("Super Admin initialized successfully.")
        print(f"Email: {admin_email}")
        print(f"Password: {admin_password}")

if __name__ == "__main__":
    asyncio.run(create_super_admin())

import asyncio
from core.database import AsyncSessionLocal
from models.user import User
from models.core import Role
from sqlalchemy import select
from sqlalchemy.orm import selectinload

async def promote_user():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).options(selectinload(User.roles)).where(User.email == "prakash.om.global@gmail.com"))
        user = res.scalars().first()
        if not user:
            print("User not found! Creating user...")
            user = User(email="prakash.om.global@gmail.com", username="prakash_admin")
            db.add(user)
            await db.commit()
            # Reload user to ensure roles are loaded
            res = await db.execute(select(User).options(selectinload(User.roles)).where(User.email == "prakash.om.global@gmail.com"))
            user = res.scalars().first()
            
        res = await db.execute(select(Role).where(Role.role_name == "admin"))
        role = res.scalars().first()
        if not role:
            role = Role(role_name="admin", description="Administrator")
            db.add(role)
            await db.commit()
            
        if not any(r.role_name == "admin" for r in user.roles):
            user.roles.append(role)
            await db.commit()
            print(f"Successfully promoted {user.email} to admin!")
        else:
            print(f"User {user.email} is already an admin!")

if __name__ == "__main__":
    asyncio.run(promote_user())

import asyncio
from uuid import uuid4
from sqlalchemy import select
from core.database import AsyncSessionLocal
from models.user import User
from models.profile import Profile, Experience, Education, Project
from models.core import Company

async def test_db_models():
    print("Testing DB inserts...")
    async with AsyncSessionLocal() as session:
        try:
            # 1. Create User
            test_username = f"verify_{uuid4().hex[:6]}"
            new_user = User(
                username=test_username,
                email=f"{test_username}@example.com",
                is_active=True
            )
            session.add(new_user)
            await session.flush()
            print("User created successfully.")

            # 2. Create Profile
            new_profile = Profile(
                user_id=new_user.id,
                full_name="Verification Test",
                headline="Software Tester",
                visibility_mode="PUBLIC"
            )
            session.add(new_profile)
            await session.flush()
            print("Profile created successfully.")

            # 3. Create Experience
            from datetime import datetime
            new_exp = Experience(
                profile_id=new_profile.id,
                company_name="Acme Corp",
                title="QA Engineer",
                start_date=datetime.utcnow()
            )
            session.add(new_exp)
            await session.flush()
            print("Experience created successfully.")

            # 4. Create Education
            new_edu = Education(
                profile_id=new_profile.id,
                school="Test University",
                degree="B.S. Computer Science",
                start_date=datetime.utcnow()
            )
            session.add(new_edu)
            await session.flush()
            print("Education created successfully.")

            # 5. Create Project
            new_proj = Project(
                profile_id=new_profile.id,
                title="Test Automation"
            )
            session.add(new_proj)
            await session.flush()
            print("Project created successfully.")

            # 6. Create Company
            new_company = Company(
                company_name="Test Company LLC",
                created_by_user_id=new_user.id
            )
            session.add(new_company)
            await session.flush()
            print("Company created successfully.")
            
            # Rollback so we don't pollute DB
            await session.rollback()
            print("All tests passed! Models and DB are perfectly in sync.")
            
        except Exception as e:
            await session.rollback()
            print(f"FAILED: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_db_models())

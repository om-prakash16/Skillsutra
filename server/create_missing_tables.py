import asyncio
import os
import sys

# Add server directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.database import engine, Base
from models import (
    admin, assessments, ats, audit, cms, community, core, cover_letter,
    ecosystem, gamification, identity, learning, notifications, oauth,
    profile, recovery, recruiter, resume, security, session, skills,
    social, taxonomy, ultimate_ecosystem, user
)

async def create_tables():
    print("Creating all missing tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())

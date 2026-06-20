import asyncio
import uuid
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

db_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@db:5432/skillsutra_db")
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(db_url, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

from core.database import Base

import models.user
import models.messaging

async def run():
    # Create all tables
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created.")

    async with AsyncSessionLocal() as session:
        # Create users
        user1 = models.user.User(
            id=uuid.uuid4(),
            username=f"dummy-user-1-{uuid.uuid4().hex[:6]}",
            email=f"dummy1-{uuid.uuid4().hex[:6]}@example.com",
            first_name="Dummy",
            last_name="One",
            password_hash="pw"
        )
        user2 = models.user.User(
            id=uuid.uuid4(),
            username=f"dummy-user-2-{uuid.uuid4().hex[:6]}",
            email=f"dummy2-{uuid.uuid4().hex[:6]}@example.com",
            first_name="Dummy",
            last_name="Two",
            password_hash="pw"
        )
        session.add(user1)
        session.add(user2)
        await session.flush()
        
        # Create conversation
        conv = models.messaging.Conversation(
            id=uuid.uuid4(),
            conversation_type="DIRECT_MESSAGE",
            participant_ids=[user1.id, user2.id]
        )
        session.add(conv)
        await session.flush()
        
        # Create message
        msg1 = models.messaging.Message(
            id=uuid.uuid4(),
            conversation_id=conv.id,
            sender_id=user1.id,
            content="Hello from User 1!"
        )
        session.add(msg1)
        
        msg2 = models.messaging.Message(
            id=uuid.uuid4(),
            conversation_id=conv.id,
            sender_id=user2.id,
            content="Hi User 1, how are you?"
        )
        session.add(msg2)
        
        await session.commit()
        
        print(f"Created User 1: {user1.id} ({user1.username})")
        print(f"Created User 2: {user2.id} ({user2.username})")
        print(f"Created Conversation: {conv.id}")
        print("Messages sent successfully!")

if __name__ == "__main__":
    asyncio.run(run())

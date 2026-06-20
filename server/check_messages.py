import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

db_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@db:5432/skillsutra_db")
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(db_url, echo=False)

async def check():
    async with engine.begin() as conn:
        print("--- Conversations ---")
        res = await conn.execute(text("SELECT id, conversation_type, participant_ids FROM messaging_conversations"))
        for row in res.fetchall():
            print(dict(row._mapping))
            
        print("\n--- Messages ---")
        res = await conn.execute(text("SELECT id, conversation_id, sender_id, content, created_at FROM messaging_messages ORDER BY created_at ASC"))
        for row in res.fetchall():
            print(dict(row._mapping))

if __name__ == '__main__':
    asyncio.run(check())

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/skillsutra")
engine = create_async_engine(DATABASE_URL)

alter_statements = [
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;"
]

async def apply_alters():
    print("Applying ALTER TABLE statements...")
    async with engine.begin() as conn:
        for stmt in alter_statements:
            try:
                await conn.execute(text(stmt))
                print(f"Executed: {stmt}")
            except Exception as e:
                print(f"Error on {stmt}: {e}")
    print("Done applying columns.")

if __name__ == "__main__":
    asyncio.run(apply_alters())

import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import engine, Base
import os
import importlib
from core.database import engine, Base

# Dynamically import all models so SQLAlchemy registers them
models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
for filename in os.listdir(models_dir):
    if filename.endswith('.py') and not filename.startswith('__') and filename != 'user.py':
        module_name = f"models.{filename[:-3]}"
        importlib.import_module(module_name)

from sqlalchemy import text

async def init_models():
    async with engine.begin() as conn:
        print("Creating extensions...")
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created.")

if __name__ == "__main__":
    asyncio.run(init_models())

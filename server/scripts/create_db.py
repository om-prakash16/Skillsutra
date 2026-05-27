import asyncio
import asyncpg
import sys

async def create_db():
    try:
        sys.stdout.write("Connecting to postgres to create skillsutra db...\n")
        conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/postgres')
        await conn.execute('CREATE DATABASE skillsutra')
        await conn.close()
        sys.stdout.write("Database created successfully.\n")
    except asyncpg.exceptions.DuplicateDatabaseError:
        sys.stdout.write("Database already exists.\n")
    except Exception as e:
        sys.stdout.write(f"Error: {e}\n")

if __name__ == "__main__":
    asyncio.run(create_db())

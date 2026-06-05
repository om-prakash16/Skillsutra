import asyncio
import asyncpg
import os
import sys

async def validate_sql_files():
    db_url_default = "postgresql://postgres:postgres@hiring-tool-db:5432/postgres"
    
    # Connect to the default postgres database to create a test DB
    try:
        conn = await asyncpg.connect(db_url_default)
        await conn.execute("DROP DATABASE IF EXISTS test_validation_db")
        await conn.execute("CREATE DATABASE test_validation_db")
        await conn.close()
        print("Created test database.")
    except Exception as e:
        print(f"Failed to create test database: {e}")
        return

    # Connect to the new test database
    db_url_test = "postgresql://postgres:postgres@hiring-tool-db:5432/test_validation_db"
    
    migrations_dir = "/app/../database/migrations"
    
    if not os.path.exists(migrations_dir):
        print(f"Directory {migrations_dir} not found.")
        return

    files = sorted([f for f in os.listdir(migrations_dir) if f.endswith('.sql')])
    
    print(f"Found {len(files)} SQL files to validate.")
    
    conn = await asyncpg.connect(db_url_test)
    
    success_count = 0
    failed_file = None
    
    for file in files:
        file_path = os.path.join(migrations_dir, file)
        with open(file_path, "r", encoding="utf-8") as f:
            sql = f.read()
            
        print(f"Validating {file}...", end=" ")
        try:
            # We use execute to run the script
            await conn.execute(sql)
            print("OK")
            success_count += 1
        except Exception as e:
            print("FAILED!")
            print(f"Error in {file}: {e}")
            failed_file = file
            break

    await conn.close()
    
    # Clean up test DB
    conn = await asyncpg.connect(db_url_default)
    await conn.execute("DROP DATABASE test_validation_db")
    await conn.close()
    
    if failed_file:
        print(f"\nValidation FAILED at file: {failed_file}")
        sys.exit(1)
    else:
        print(f"\nValidation SUCCESS. All {success_count} SQL files are valid and executed perfectly.")
        sys.exit(0)

if __name__ == "__main__":
    asyncio.run(validate_sql_files())

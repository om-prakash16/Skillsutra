import asyncio
import asyncpg
import json
import os
import sys
import uuid
from dotenv import load_dotenv

# Ensure the server root is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/skillsutra")

async def insert_data():
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        base_path = os.path.dirname(__file__)
        json_path = os.path.join(base_path, "test_accounts.json")
        
        with open(json_path, "r") as f:
            data = json.load(f)
            
        print("Inserting Companies...")
        for company in data.get("companies", []):
            try:
                # Check if user already exists by email
                row = await conn.fetchrow("SELECT id FROM users WHERE email = $1", company["email"])
                if row:
                    user_id = row["id"]
                else:
                    user_id = str(uuid.uuid4())
                    username = company["name"].replace(" ", "_").lower() + str(uuid.uuid4())[:4]
                    await conn.execute(
                        "INSERT INTO users (id, wallet_address, username, email, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING",
                        user_id, company["wallet"], username, company["email"], company["role"]
                    )

                await conn.execute(
                    "INSERT INTO profiles (user_id, full_name, headline) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    user_id, company["name"], company["title"]
                )
            except Exception as e:
                print(f"Error inserting company {company['name']}: {e}")
                
        print("Inserting Candidates...")
        for candidate in data.get("candidates", []):
            try:
                # Check if user already exists by email
                row = await conn.fetchrow("SELECT id FROM users WHERE email = $1", candidate["email"])
                if row:
                    user_id = row["id"]
                else:
                    user_id = str(uuid.uuid4())
                    # Use a unique string for username
                    username = candidate["name"].replace(" ", "_").lower() + str(uuid.uuid4())[:4]
                    
                    await conn.execute(
                        "INSERT INTO users (id, wallet_address, username, email, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING",
                        user_id, candidate["wallet"], username, candidate["email"], candidate["role"]
                    )
                
                await conn.execute(
                    "INSERT INTO profiles (user_id, full_name, headline) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    user_id, candidate["name"], candidate.get("title", "Candidate")
                )
            except Exception as e:
                print(f"Error inserting candidate {candidate['name']}: {e}")

        await conn.close()
        print("Data inserted successfully into local PostgreSQL.")
    except Exception as e:
        print(f"Database connection error: {e}")

if __name__ == "__main__":
    asyncio.run(insert_data())

import json
import uuid
import os
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

def run_elite_seeding():
    """
    Actually populates the database with Elite Hackathon data.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL or SUPABASE_SERVICE_KEY missing.")
        return

    supabase: Client = create_client(url, key)

    # IDs for linking
    sarah_id = str(uuid.uuid4())
    marcus_id = str(uuid.uuid4())
    
    print(f"Seeding Elite Candidates: Sarah ({sarah_id}), Marcus ({marcus_id})...")

    # 1. Seed Users
    users = [
        {
            "id": sarah_id,
            "full_name": "Sarah Chen",
            "role": "candidate",
            "wallet_address": "C1S...sarah",
            "email": "sarah@besthiringtool.test",
            "profile_data": {
                "title": "Principal Protocol Architect",
                "bio": "Specializing in high-throughput L1/L2 orchestration.",
                "skills": ["Rust", "Solana", "Anchor"],
                "soft_skills": ["Architectural Leadership", "Mentorship"]
            }
        },
        {
            "id": marcus_id,
            "full_name": "Marcus Volkov",
            "role": "candidate",
            "wallet_address": "V8...marcus",
            "email": "marcus@besthiringtool.test",
            "profile_data": {
                "title": "AI Infrastructure Lead",
                "bio": "Building node networks for autonomous agency.",
                "skills": ["Python", "PyTorch", "FastAPI"],
                "soft_skills": ["Problem Solving", "Scalability"]
            }
        }
    ]
    
    for user in users:
        supabase.table("users").upsert(user).execute()

    # 2. Seed Projects
    projects = [
        {
            "id": str(uuid.uuid4()),
            "user_id": sarah_id,
            "title": "Solana Shield Protocol",
            "description": "Zero-knowledge transaction mixer.",
            "stack": ["Rust", "Anchor"],
            "github_url": "https://github.com/sarah/solana-shield"
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": marcus_id,
            "title": "Neural Talent Link",
            "description": "Multi-agent orchestration layer.",
            "stack": ["Python", "FastAPI"],
            "github_url": "https://github.com/marcus/neuro-link"
        }
    ]
    
    for project in projects:
        supabase.table("project_ledger").upsert(project).execute()

    print("Seeding complete. Best Hiring Tool environment is now RATED ELITE.")

if __name__ == "__main__":
    run_elite_seeding()

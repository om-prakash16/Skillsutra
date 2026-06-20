import asyncio
import datetime
from core.db import get_db

async def seed_data():
    from db.engine import init_db
    await init_db()
    db = get_db()
    if not db:
        print("[ERROR] Database client not initialized. Check .env")
        return

    print("--- Starting Data Seeding Protocol ---")

    # 1. Use Existing Admin User
    user_id = "30811af7-47ed-475d-9a77-497c6fd47d88"  # Admin User
    print(f"[1/4] Using active Admin Node: {user_id}")

    # Ensure admin user exists in DB first
    try:
        await db.table("users").insert({
            "id": user_id,
            "username": "admin",
            "email": "admin@skillsutra.com",
            "first_name": "Admin",
            "last_name": "User"
        }).execute()
        print("  + Admin user node established.")
    except Exception as e:
        print(f"  [!] Admin user node established or exists: {e}")

    # 2. Check/Assign COMPANY role
    print("[2/4] Verifying role permissions...")
    try:
        role_resp = await db.table("roles").select("id").eq("role_name", "COMPANY").execute()
        if role_resp.data:
            role_id = role_resp.data[0]["id"]
            existing_role = await (
                db.table("user_roles")
                .select("*")
                .eq("user_id", user_id)
                .eq("role_id", role_id)
                .execute()
            )
            if not existing_role.data:
                await db.table("user_roles").insert(
                    {"user_id": user_id, "role_id": role_id}
                ).execute()
                print("  + COMPANY role assigned.")
            else:
                print("  + Role already established.")
    except Exception as e:
        print(f"  [!] Role assignment skipped: {e}")

    # 3. Create Dummy Company
    company_name = "Best Hiring Tool AI - Demo Corp"
    print(f"[3/4] Synthesizing dummy company node: {company_name}")
    import uuid
    company_id = str(uuid.uuid4())
    try:
        company_resp = await (
            db.table("companies")
            .insert(
                {
                    "id": company_id,
                    "company_name": company_name,
                    "created_by_user_id": user_id,
                }
            )
            .execute()
        )

        if not company_resp.data:
            print("[ERROR] Failed to create company (RLS Violation?)")
            return

        company_id = company_resp.data[0]["id"]
        print(f"  + Company established: {company_id}")

        # Add as owner in company_members
        member_id = str(uuid.uuid4())
        await db.table("company_members").insert(
            {"id": member_id, "company_id": company_id, "user_id": user_id, "company_role": "OWNER"}
        ).execute()
    except Exception as e:
        print(f"[ERROR] Company synthesis failed: {e}")
        return

    # 4. Create 6 Dummy Jobs
    print(f"[4/4] Generating 6 dummy jobs for {company_name}...")

    jobs_data = [
        {
            "title": "Senior AI Resonance Architect",
            "description": "Lead the development of our core semantic matching engine. Optimize RAG pipelines and vector database resonance.",
            "experience_level": "Senior",
            "salary_range": "$160k - $220k",
            "job_type": "remote",
            "location": "Global",
            "created_at": (
                datetime.datetime.now() - datetime.timedelta(days=2)
            ).isoformat(),
        },
        {
            "title": "Full-Stack Node Engineer (Identity Layer)",
            "description": "Build high-performance UIs using Next.js 14 and integrate them with our blockchain identity protocols.",
            "experience_level": "Mid-Senior",
            "salary_range": "$130k - $180k",
            "job_type": "hybrid",
            "location": "SF / Palo Alto",
            "created_at": (
                datetime.datetime.now() - datetime.timedelta(days=5)
            ).isoformat(),
        },
        {
            "title": "Frontend Interface Designer",
            "description": "Craft premium, glassmorphic interfaces that wow our enterprise partners. Expert-level knowledge of Framer Motion is required.",
            "experience_level": "Senior",
            "salary_range": "$110k - $160k",
            "job_type": "remote",
            "location": "Global",
            "created_at": (
                datetime.datetime.now() - datetime.timedelta(days=10)
            ).isoformat(),
        },
        {
            "title": "Database Reliability Engineer",
            "description": "Ensure the high availability and integrity of our global hiring mesh. Focus on PostgreSQL and Database performance.",
            "experience_level": "Expert",
            "salary_range": "$150k - $200k",
            "job_type": "onsite",
            "location": "Houston, TX",
            "created_at": (
                datetime.datetime.now() - datetime.timedelta(days=15)
            ).isoformat(),
        },
        {
            "title": "Junior Python Developer (Automation)",
            "description": "Develop and maintain background tasks and notification triggers for the Best Hiring Tool ecosystem.",
            "experience_level": "Junior",
            "salary_range": "$70k - $100k",
            "job_type": "remote",
            "location": "London, UK",
            "created_at": (
                datetime.datetime.now() - datetime.timedelta(days=22)
            ).isoformat(),
        },
        {
            "title": "Blockchain Protocol Lead",
            "description": "Design and implement soulbound NFT minting logic and on-chain resume verification smart contracts.",
            "experience_level": "Senior",
            "salary_range": "$180k - $250k",
            "job_type": "hybrid",
            "location": "Berlin, DE",
            "created_at": (
                datetime.datetime.now() - datetime.timedelta(days=30)
            ).isoformat(),
        },
    ]

    for job in jobs_data:
        job_id = str(uuid.uuid4())
        desc = job.pop("description")
        experience_level = job.pop("experience_level")
        salary_range = job.pop("salary_range")
        job_type = job.pop("job_type")
        location = job.pop("location")
        
        await db.table("jobs").insert(
            {
                "id": job_id, 
                "company_id": company_id, 
                "description_markdown": desc,
                "requirements": {"experience_level": experience_level},
                "logistics": {"salary_range": salary_range, "location": location, "remote_policy": job_type},
                **job, 
                "status": "OPEN"
            }
        ).execute()
        print(f"  + Added Job: {job['title']}")

    print("\n--- Seeding Complete! ---")
    print(f"Company ID: {company_id}")

if __name__ == "__main__":
    asyncio.run(seed_data())

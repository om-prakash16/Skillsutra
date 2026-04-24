import asyncio
import uuid
from core.supabase import get_supabase
from modules.projects.service import ProjectService
from modules.skill_graph.service import SkillGraphService

async def verify_proof_of_work_flow():
    print("--- VERIFYING STEP 2: PROJECT-TO-SKILL PROOF BOOST ---")
    db = get_supabase()
    project_service = ProjectService()
    skill_service = SkillGraphService()

    # 1. Setup: Ensure a test user and a test skill exist
    # (We'll use a known skill from the taxonomy: Python)
    res = db.table("skill_taxonomy").select("id").eq("slug", "python").single().execute()
    skill_id = res.data["id"]
    
    # Using a deterministic UUID for the test user to avoid clutter
    test_user_id = "00000000-0000-0000-0000-000000000001"
    
    # 2. Add skill to user (initial proof_score = 0)
    print("Initializing test skill for user...")
    node = await skill_service.add_skill(test_user_id, {"skill_id": skill_id, "source": "self_claimed"})
    initial_score = node.get("proof_score", 0)
    print(f"Initial Proof Score: {initial_score}")

    # 3. Create a project
    print("Creating test project...")
    project = await project_service.create_project(test_user_id, {
        "title": "Verification Test App",
        "description": "A project built to verify the PoW system.",
        "role": "Lead Tester",
        "stack": ["Python", "Pytest"]
    })
    project_id = project["id"]
    print(f"Project created with ID: {project_id}")

    # 4. Link skill to project (This should trigger the boost)
    print("Linking skill to project (Triggering Proof Boost)...")
    await project_service.link_skills_to_project(
        user_id=test_user_id,
        project_id=project_id,
        skill_ids=[skill_id],
        usage_context="Main logic was written in Python.",
        weight=1.5 # 1.5x boost multiplier
    )

    # 5. Verify the boost
    # Wait a second for trigger to propagate if needed (Supabase triggers are immediate but let's be sure)
    await asyncio.sleep(1)
    
    updated_node_res = db.table("user_skill_nodes").select("proof_score").eq("id", node["id"]).single().execute()
    updated_score = updated_node_res.data["proof_score"]
    
    print(f"Updated Proof Score: {updated_score}")
    
    if updated_score > initial_score:
        print(f"[SUCCESS] Proof score increased by {updated_score - initial_score}")
    else:
        print("[FAIL] Proof score did not increase")

    # Cleanup
    print("Cleaning up...")
    db.table("project_ledger").delete().eq("id", project_id).execute()
    db.table("user_skill_nodes").delete().eq("id", node["id"]).execute()
    db.table("skill_usage_events").delete().eq("user_id", test_user_id).execute()
    print("[OK] Cleanup complete")

if __name__ == "__main__":
    asyncio.run(verify_proof_of_work_flow())

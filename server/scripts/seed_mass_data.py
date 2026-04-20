import random
import uuid
import json
import csv
import os
import sys
from dotenv import load_dotenv

# Ensure the server root is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from supabase import create_client

# -- Configuration --
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "") 
SERVICE_KEY  = os.getenv("SUPABASE_SERVICE_KEY", "")

key_to_use = SERVICE_KEY if SERVICE_KEY else SUPABASE_KEY
db = create_client(SUPABASE_URL, key_to_use) if SUPABASE_URL and key_to_use else None

# -- Data Pools --
FIRST_NAMES = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Kevin", "Laura", "Mike", "Nina", "Oscar", "Paul", "Quinn", "Rose", "Steve", "Tara"]
LAST_NAMES = ["Smith", "Doe", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark"]
COMPANY_NAMES = ["NexaTech", "QuantumAI", "CryptoForge", "DataPulse", "CloudNine", "NeuralPath", "BlockChainVentures", "HyperScale", "DeepMind", "StellarProtocol"]
TITLES = ["Frontend Engineer", "Backend Developer", "Full-Stack Developer", "Data Scientist", "ML Engineer", "Blockchain Developer", "DevOps Engineer", "Cloud Architect", "iOS Developer", "Security Analyst"]

def generate_wallet():
    return "0x" + uuid.uuid4().hex[:40]

def seed():
    print("\n--- SKILLPROOF AI TEST CREDENTIAL GENERATOR ---")
    
    accounts_manifest = {"companies": [], "candidates": []}
    csv_rows = [] # Flat list for spreadsheet export

    # 1. Generate 10 Company Identities
    print("Generating 10 Company Lead Identities...")
    for i in range(1, 11):
        wallet = generate_wallet()
        comp_name = f"{random.choice(COMPANY_NAMES)} {i}"
        account = {
            "name": f"Recruiter {random.choice(FIRST_NAMES)} {i}",
            "company": comp_name,
            "wallet": wallet,
            "email": f"hr_{i}@{comp_name.lower().replace(' ', '')}.com",
            "role": "company"
        }
        accounts_manifest["companies"].append(account)
        csv_rows.append([account["name"], account["email"], account["wallet"], account["role"], account["company"]])
        
        # Immediate DB Attempt (Internal block)
        if db:
            try:
                uid = str(uuid.uuid4())
                db.table("users").insert({
                    "id": uid, "wallet_address": wallet, "full_name": account["name"], 
                    "email": account["email"], "role": "company"
                }).execute()
                c_res = db.table("companies").insert({"name": comp_name, "created_by_user_id": uid}).execute()
                if c_res.data:
                    db.table("company_members").insert({"company_id": c_res.data[0]["id"], "user_id": uid, "company_role": "OWNER"}).execute()
            except: pass

    # 2. Generate 100 Candidate Identities
    print("Generating 100 Candidate Identities...")
    for x in range(1, 101):
        wallet = generate_wallet()
        fname = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)} {x}"
        account = {
            "name": fname,
            "wallet": wallet,
            "email": f"candidate_{x}@besthiringtool.test",
            "role": "talent",
            "company": "N/A"
        }
        accounts_manifest["candidates"].append(account)
        csv_rows.append([account["name"], account["email"], account["wallet"], account["role"], account["company"]])
        
        # Immediate DB Attempt
        if db:
            try:
                db.table("users").insert({
                    "id": str(uuid.uuid4()), "wallet_address": wallet, "full_name": fname, 
                    "email": account["email"], "role": "talent"
                }).execute()
            except: pass
        
        if x % 25 == 0:
            print(f"  ... {x}/100 generated")

    # Save JSON manifest
    base_path = os.path.dirname(__file__)
    json_path = os.path.join(base_path, "test_accounts.json")
    with open(json_path, "w") as f:
        json.dump(accounts_manifest, f, indent=4)
    
    # Save CSV manifest (Excel Friendly)
    csv_path = os.path.join(base_path, "test_accounts.csv")
    with open(csv_path, "w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Email", "Wallet Address", "Role", "Company"])
        writer.writerows(csv_rows)
    
    print(f"\nManifests generated successfully.")
    print(f"JSON: {json_path}")
    print(f"CSV (Excel): {csv_path}")

if __name__ == "__main__":
    seed()

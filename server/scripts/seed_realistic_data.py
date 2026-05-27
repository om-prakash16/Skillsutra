import asyncio
import os
import sys
import uuid
import random
import datetime

# Ensure the server root is in path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.postgres_adapter import PostgresAdapter

db = PostgresAdapter()

# Realistic Seed Data Pools
FIRST_NAMES = ["Liam", "Emma", "Noah", "Olivia", "William", "Ava", "James", "Isabella", "Oliver", "Sophia", "Benjamin", "Mia", "Elijah", "Charlotte", "Lucas", "Amelia", "Mason", "Harper", "Logan", "Evelyn", "Alexander", "Abigail", "Ethan", "Emily", "Jacob", "Elizabeth", "Michael", "Mila", "Daniel", "Ella", "Henry", "Avery", "Jackson", "Sofia", "Sebastian", "Camila", "Aiden", "Aria", "Matthew", "Scarlett", "Samuel", "Victoria", "David", "Madison", "Joseph", "Luna", "Carter", "Grace", "Owen", "Chloe"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins"]

COMPANY_NAMES = ["Stripe", "Airbnb", "Netflix", "Spotify", "Vercel", "Supabase", "OpenAI", "Anthropic", "Linear", "Notion", "Figma", "Scale AI", "Databricks", "Snowflake", "Plaid", "Rippling", "Brex", "Ramp", "Deel", "Gusto"]
COMPANY_SUFFIXES = [" Inc.", " LLC", " Tech", " Systems", " Networks", " Solutions"]

TECH_STACKS = [
    ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "Redis"],
    ["TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "GraphQL"],
    ["Java", "Spring Boot", "MySQL", "Kubernetes", "Kafka", "Microservices"],
    ["Go", "gRPC", "Docker", "Kubernetes", "PostgreSQL", "Prometheus"],
    ["Rust", "WebAssembly", "C++", "Linux", "Systems Programming"],
    ["Python", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn", "Machine Learning"],
    ["Ruby", "Ruby on Rails", "PostgreSQL", "Redis", "Heroku", "AWS"],
    ["C#", ".NET Core", "SQL Server", "Azure", "React", "TypeScript"],
    ["Solidity", "Ethereum", "Web3.js", "Hardhat", "TypeScript", "Smart Contracts"],
    ["Swift", "iOS", "Objective-C", "CoreData", "Firebase"],
    ["Kotlin", "Android", "Jetpack Compose", "Coroutines", "Room"],
    ["Flutter", "Dart", "Firebase", "Provider", "Mobile Development"],
    ["SQL", "Tableau", "Power BI", "Snowflake", "Looker", "Data Analysis"],
    ["Scala", "Spark", "Hadoop", "Airflow", "Big Data", "Data Engineering"],
    ["OpenAI API", "LangChain", "LLMs", "Vector Databases", "Pinecone", "Prompt Engineering"],
    ["Rust", "Solana", "Anchor", "Web3", "Cryptography"],
    ["Figma", "UI/UX Design", "Wireframing", "Prototyping", "Adobe Creative Suite"],
    ["Product Management", "Agile", "Scrum", "Jira", "Roadmapping", "A/B Testing"],
    ["SEO", "Content Strategy", "Google Analytics", "Growth Hacking", "Social Media"],
    ["Cybersecurity", "Penetration Testing", "Network Security", "Cryptography", "OWASP"]
]

ROLES = [
    "Software Engineer", "Senior Software Engineer", "Staff Engineer", "Principal Engineer",
    "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "iOS Developer", "Android Developer", "Mobile Engineer",
    "Data Scientist", "Data Engineer", "Data Analyst", "Machine Learning Engineer", "AI Researcher",
    "DevOps Engineer", "Cloud Architect", "Site Reliability Engineer", "Platform Engineer",
    "Smart Contract Developer", "Blockchain Engineer", "Web3 Developer",
    "Product Manager", "Senior Product Manager", "Technical Program Manager",
    "UI/UX Designer", "Product Designer", "Graphic Designer",
    "Growth Marketing Manager", "SEO Specialist", "Content Strategist",
    "Security Engineer", "Information Security Analyst"
]
LOCATIONS = ["San Francisco, CA", "New York, NY", "London, UK", "Berlin, Germany", "Remote", "Austin, TX", "Seattle, WA", "Toronto, Canada", "Singapore", "Sydney, Australia", "Bangalore, India"]

def generate_wallet():
    return "0x" + uuid.uuid4().hex[:40]

async def seed_data():
    print("\n--- SKILLPROOF REALISTIC DATA SEEDER ---")
    
    # 1. Generate Companies
    print("Generating 50 Realistic Companies...")
    companies_data = []
    for i in range(50):
        comp_name = random.choice(COMPANY_NAMES) + random.choice(COMPANY_SUFFIXES) + f" {i}"
        company = {
            "id": str(uuid.uuid4()),
            "name": comp_name,
            "industry": "Technology",
            "created_at": datetime.datetime.utcnow().isoformat()
        }
        companies_data.append(company)
        
    await db.table("companies").upsert(companies_data).execute()
    print("✓ 50 Companies generated.")

    # 2. Generate 100 Talent Users
    print("Generating 100 Realistic Talent Profiles...")
    
    users = []
    profiles = []
    ai_scores = []
    search_candidates = []
    
    for i in range(100):
        user_id = str(uuid.uuid4())
        wallet = generate_wallet()
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        full_name = f"{first_name} {last_name}"
        email = f"{first_name.lower()}.{last_name.lower()}{i}@example.com"
        
        stack = random.choice(TECH_STACKS)
        role = random.choice(ROLES)
        location = random.choice(LOCATIONS)
        experience_years = random.randint(1, 12)
        score = random.randint(650, 950)
        
        # User record
        users.append({
            "id": user_id,
            "wallet_address": wallet,
            "full_name": full_name,
            "email": email,
            "role": "talent",
            "reputation_score": score,
            "visibility": "public",
            "created_at": datetime.datetime.utcnow().isoformat()
        })
        
        # Profile record
        profiles.append({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "full_name": full_name,
            "headline": f"{role} with {experience_years}+ years experience",
            "bio": f"Passionate {role} specializing in scalable architecture and clean code.",
            "location": location,
            "current_position": role,
            "updated_at": datetime.datetime.utcnow().isoformat()
        })
        
        # AI Scores (Critical for Matcher)
        ai_scores.append({
            "user_id": user_id,
            "skill_score": random.randint(70, 99),
            "forensic_confidence": random.randint(80, 99),
            "primary_role": role,
            "extracted_skills": stack,
            "soft_skills": ["Communication", "Leadership", "Problem Solving"],
            "experience_years": experience_years
        })
        
        # Search Candidates index
        search_candidates.append({
            "user_id": user_id,
            "full_name": full_name,
            "skills": stack,
            "experience_level": "Senior" if experience_years >= 5 else "Mid-Level",
            "proof_score": score,
            "location": location,
            "search_vector": f"{full_name} {role} {' '.join(stack)} {location}".lower(),
            "updated_at": datetime.datetime.utcnow().isoformat()
        })

    # Batch Insert
    print("Writing to DB...")
    await db.table("users").upsert(users).execute()
    await db.table("profiles").upsert(profiles).execute()
    await db.table("ai_scores").upsert(ai_scores).execute()
    await db.table("search_candidates").upsert(search_candidates).execute()
    
    print("✓ 100 Talent Users seeded successfully with robust AI indexes!")
    print("\n--- SEED COMPLETE ---")

if __name__ == "__main__":
    asyncio.run(seed_data())

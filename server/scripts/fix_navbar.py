import asyncio
import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.db import get_db
from db.engine import init_db

async def fix_navbar():
    await init_db()
    try:
        print("Connecting to Supabase...")
        sb = get_db()
        if not sb:
            print("Failed to initialize Supabase client.")
            return

        res = sb.table("site_content").select("*").eq("section_key", "navbar").eq("content_key", "links").execute()
        if not res.data:
            print("No navbar links found in DB.")
            return

        content_id = res.data[0]['id']
        current_value = res.data[0]['content_value']
        
        links = json.loads(current_value)
        
        changed = False
        for link in links:
            if link.get("href") == "/welcome":
                link["href"] = "/about"
                changed = True
        
        if changed:
            new_value = json.dumps(links)
            sb.table("site_content").update({"content_value": new_value}).eq("id", content_id).execute()
            print("Successfully updated navbar links from /welcome to /about")
        else:
            print("No /welcome link found in the JSON payload.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(fix_navbar())

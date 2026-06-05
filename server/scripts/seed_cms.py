import os
import sys
import uuid
import asyncio
from datetime import datetime

# Add the server directory to sys.path so we can import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.db import get_db
from db.engine import init_db

async def seed_cms():
    await init_db()
    try:
        print("Connecting to Supabase...")
        sb = get_db()
        if not sb:
            print("Failed to initialize Supabase client.")
            return

        print("Seeding CMS Pages...")
        # Home Page
        home_id = str(uuid.uuid4())
        await sb.table("cms_pages").upsert({
            "id": home_id,
            "title": "Home Page",
            "slug": "/",
            "status": "PUBLISHED",
            "meta_title": "Enterprise Talent Matching",
            "meta_description": "AI-driven recruiting for elite engineering teams.",
            "content_blocks": [
                {
                    "type": "hero",
                    "data": {
                        "heading": "Find Elite Engineering Talent",
                        "subheading": "The AI-driven recruiting platform for modern enterprises.",
                        "cta_text": "Get Started",
                        "cta_link": "/auth/register"
                    }
                }
            ]
        }, on_conflict="slug").execute()

        # About Page
        about_id = str(uuid.uuid4())
        await sb.table("cms_pages").upsert({
            "id": about_id,
            "title": "About Us",
            "slug": "/about",
            "status": "PUBLISHED",
            "meta_title": "About Our Platform",
            "meta_description": "Learn more about our mission.",
            "content_blocks": [
                {
                    "type": "text_block",
                    "data": {
                        "content": "We are revolutionizing how companies hire top engineers."
                    }
                }
            ]
        }).execute()

        print("Seeding CMS Taxonomy...")
        cat_engineering_id = str(uuid.uuid4())
        await sb.table("cms_taxonomy").upsert({
            "id": cat_engineering_id,
            "name": "Engineering",
            "slug": "engineering",
            "type": "CATEGORY"
        }).execute()

        cat_career_id = str(uuid.uuid4())
        await sb.table("cms_taxonomy").upsert({
            "id": cat_career_id,
            "name": "Career Advice",
            "slug": "career-advice",
            "type": "CATEGORY"
        }).execute()

        print("Seeding CMS Articles...")
        # Get a real user ID for the author
        users = await sb.table("users").select("id").limit(1).execute()
        author_id = users.data[0]["id"] if users.data else None
        
        article_1_id = str(uuid.uuid4())
        await sb.table("cms_articles").upsert({
            "id": article_1_id,
            "title": "How to Ace the Technical Interview",
            "slug": "ace-technical-interview",
            "excerpt": "A comprehensive guide to passing modern system design and algorithms rounds.",
            "content": "## Introduction\n\nTechnical interviews have evolved. Here is what you need to know...",
            "status": "PUBLISHED",
            "published_at": datetime.utcnow().isoformat(),
            "author_id": author_id,
            "cover_image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
            "seo_metadata": {
                "keywords": ["interview", "engineering", "system design"]
            }
        }).execute()
        
        # Link Article to Category
        await sb.table("cms_article_taxonomy").upsert({
            "article_id": article_1_id,
            "taxonomy_id": cat_career_id
        }, on_conflict="article_id, taxonomy_id").execute()

        print("Seeding Global Banners...")
        await sb.table("cms_banners").upsert({
            "id": str(uuid.uuid4()),
            "name": "Winter Hiring Event",
            "content": "Join our virtual hiring event next week! Over 50 companies attending.",
            "type": "ANNOUNCEMENT",
            "is_active": True,
            "link_url": "/events/winter-hiring",
            "placement": "GLOBAL_TOP"
        }).execute()

        print("✅ CMS seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding CMS: {e}")

if __name__ == "__main__":
    asyncio.run(seed_cms())

import asyncio
from core.database import engine
from sqlalchemy import text

async def init_tables():
    async with engine.begin() as conn:
        print("Creating site_content table...")
        await conn.execute(text("""
            CREATE TABLE IF NOT EXISTS site_content (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                section_key VARCHAR NOT NULL,
                content_key VARCHAR NOT NULL,
                content_value TEXT NOT NULL,
                metadata JSONB DEFAULT '{}'::jsonb,
                is_active BOOLEAN DEFAULT true,
                updated_by UUID,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))
        
        print("Creating blog_posts table...")
        await conn.execute(text("""
            CREATE TABLE IF NOT EXISTS blog_posts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR NOT NULL,
                slug VARCHAR UNIQUE NOT NULL,
                excerpt TEXT,
                content TEXT,
                category VARCHAR DEFAULT 'General',
                featured_image VARCHAR,
                read_time VARCHAR DEFAULT '5 min',
                is_published BOOLEAN DEFAULT false,
                author_id UUID,
                author_name VARCHAR,
                published_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))
        print("Tables created successfully.")

if __name__ == "__main__":
    asyncio.run(init_tables())

import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import engine

# Mock Data for the Blog
FEATURED_POST = {
  "slug": "future-of-ai-hiring-2026",
  "title": "The Future of AI in Hiring: Moving Beyond Resumes in 2026",
  "excerpt": "How cryptographic Proof Scores and AI-driven skill resonance are replacing traditional ATS systems and subjective human screening to create a perfectly meritocratic job market.",
  "content": "# The Future of AI in Hiring\\n\\nResumes are dead. In 2026, the job market has evolved past the subjective, biased, and easily faked document that dominated hiring for decades.\\n\\nInstead, hiring is powered by **Skill Resonance** and **Cryptographic Proof Scores**.\\n\\n## Why the Resume Failed\\nTraditional ATS systems parsed keywords. This led to candidates \"keyword stuffing\" their resumes, while truly talented individuals who lacked specific jargon were filtered out. The system rewarded those who knew how to play the game, not those who were the best fit for the job.\\n\\n## The Rise of Proof Scores\\nProof scores are immutable, mathematically verified indicators of your actual ability. Rather than claiming you know React or Python, you solve a cryptographic challenge, contribute to open source, or participate in a simulated engineering environment. Your performance is scored by a decentralized network of nodes, resulting in a verifiable credential.\\n\\n## AI Skill Resonance\\nWhen companies hire, they no longer search for job titles. They input a complex multi-dimensional matrix of technical requirements, soft skills, and team culture vectors. AI models instantly calculate the \"resonance\" between the company's requirements and your verified Proof Scores, finding the mathematical perfect match.",
  "category": "Industry Insights",
  "read_time": "8 min read",
  "author_name": "Dr. Elena Rostova",
  "image_gradient": "from-primary/20 via-primary/5 to-transparent",
  "is_published": True
}

BLOG_POSTS = [
  {
    "slug": "understanding-proof-scores",
    "title": "Understanding Proof Scores: The Mathematics of Verification",
    "excerpt": "A deep dive into how SkillSutra calculates and verifies your technical abilities using decentralized identity nodes.",
    "content": "# Understanding Proof Scores\\n\\nSkillSutra calculates and verifies your technical abilities using decentralized identity nodes... (More content to be added soon.)",
    "category": "Platform Updates",
    "read_time": "5 min read",
    "author_name": "Engineering Team",
    "is_published": True
  },
  {
    "slug": "top-skills-q3",
    "title": "The Most In-Demand Engineering Skills for Q3",
    "excerpt": "Based on 4.9M+ identity nodes, we analyzed the fastest growing technical requirements across Fortune 500 companies.",
    "content": "# The Most In-Demand Engineering Skills\\n\\nBased on 4.9M+ identity nodes, we analyzed the fastest growing technical requirements... (More content to be added soon.)",
    "category": "Market Data",
    "read_time": "6 min read",
    "author_name": "Data Science Team",
    "is_published": True
  },
  {
    "slug": "eliminating-bias-ai",
    "title": "Eliminating Unconscious Bias with AI Skill Matching",
    "excerpt": "How blind, data-driven skill assessments are helping companies build more diverse and capable engineering teams.",
    "content": "# Eliminating Unconscious Bias\\n\\nHow blind, data-driven skill assessments are helping companies build more diverse teams... (More content to be added soon.)",
    "category": "Diversity & Inclusion",
    "read_time": "10 min read",
    "author_name": "Ethics Board",
    "is_published": True
  },
  {
    "slug": "crypto-credentials",
    "title": "Why Portable Cryptographic Credentials are the Future",
    "excerpt": "Take your verified skills with you. Understanding the mechanics of portable, blockchain-backed professional identities.",
    "content": "# Portable Cryptographic Credentials\\n\\nTake your verified skills with you... (More content to be added soon.)",
    "category": "Web3 & Identity",
    "read_time": "7 min read",
    "author_name": "Web3 Research",
    "is_published": True
  },
  {
    "slug": "developer-roadmap",
    "title": "Building an Unbeatable Developer Portfolio in the AI Era",
    "excerpt": "Stand out to algorithmic matchmakers by optimizing the specific data points that AI recruiters prioritize.",
    "content": "# Developer Portfolio in the AI Era\\n\\nStand out to algorithmic matchmakers... (More content to be added soon.)",
    "category": "Career Advice",
    "read_time": "6 min read",
    "author_name": "Career Coaches",
    "is_published": True
  },
  {
    "slug": "skillsutra-v4",
    "title": "Announcing SkillSutra Core Protocol v4.1.0",
    "excerpt": "Faster telemetry syncing, enhanced skill resonance matching, and new enterprise APIs for seamless ATS integration.",
    "content": "# SkillSutra Core Protocol v4.1.0\\n\\nFaster telemetry syncing, enhanced skill resonance matching... (More content to be added soon.)",
    "category": "Platform Updates",
    "read_time": "4 min read",
    "author_name": "Product Team",
    "is_published": True
  }
]

async def seed_posts():
    await engine.init_db()
    
    async with engine.pool.acquire() as conn:
        print("Seeding featured post...")
        await conn.execute("""
            INSERT INTO public.blog_posts (slug, title, excerpt, content, category, author_name, read_time, image_gradient, is_published, published_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
            ON CONFLICT (slug) DO NOTHING
        """, FEATURED_POST["slug"], FEATURED_POST["title"], FEATURED_POST["excerpt"], FEATURED_POST["content"], FEATURED_POST["category"], FEATURED_POST["author_name"], FEATURED_POST["read_time"], FEATURED_POST["image_gradient"], FEATURED_POST["is_published"])
        
        print("Seeding other posts...")
        for post in BLOG_POSTS:
            await conn.execute("""
                INSERT INTO public.blog_posts (slug, title, excerpt, content, category, author_name, read_time, is_published, published_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
                ON CONFLICT (slug) DO NOTHING
            """, post["slug"], post["title"], post["excerpt"], post["content"], post["category"], post["author_name"], post["read_time"], post["is_published"])
        
        print("Success! Blog posts seeded.")

if __name__ == "__main__":
    asyncio.run(seed_posts())

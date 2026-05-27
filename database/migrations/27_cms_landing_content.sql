INSERT INTO site_content (section_key, content_key, content_value, metadata, updated_by)
VALUES 
    -- Testimonials
    ('landing', 'testimonials', '[
        {
            "name": "Priya Sharma",
            "role": "VP of Engineering",
            "company": "TechVault India",
            "content": "We cut our time-to-hire by 60% after switching to SkillProof AI. The AI Proof Scores gave us confidence to skip the traditional 3-round technical screening — the verification data was that reliable.",
            "rating": 5,
            "avatar": "https://i.pravatar.cc/150?u=priya"
        },
        {
            "name": "James Walker",
            "role": "CTO",
            "company": "Meridian Labs",
            "content": "As a startup CTO, every hire is critical. SkillProof AI''s JD-to-candidate matching found us a senior Rust developer in 48 hours — someone traditional job boards couldn''t surface in 3 months.",
            "rating": 5,
            "avatar": "https://i.pravatar.cc/150?u=james"
        },
        {
            "name": "Ananya Reddy",
            "role": "Senior Developer",
            "company": "Freelance",
            "content": "As a self-taught developer, I always struggled to prove my skills on paper. My SkillProof AI Proof Score finally gives me a verified credential that companies actually trust. I got 3 interview calls in my first week.",
            "rating": 5,
            "avatar": "https://i.pravatar.cc/150?u=ananya"
        }
    ]', '{"type": "json", "description": "Landing page testimonials array"}', NULL),

    -- FAQs
    ('landing', 'faqs', '[
        {
            "question": "How does the verification engine actually work?",
            "answer": "Our engine uses a multi-layered approach including AI-driven code analysis, deterministic skill assessments, and cross-reference verification against known professional repositories. This creates a high-fidelity Proof Score for every skill claim."
        },
        {
            "question": "Is my personal data secure?",
            "answer": "Security is our top priority. We use enterprise-grade encryption for all data at rest and in transit. Your identity is verified through secure OAuth protocols, and you maintain full control over who can see your verified credentials."
        },
        {
            "question": "Can I integrate this with my existing ATS?",
            "answer": "Yes, our platform is designed to be ecosystem-first. We provide robust APIs and pre-built integrations for major Applicant Tracking Systems like Greenhouse, Lever, and Workable."
        },
        {
            "question": "What makes Proof Scores different from traditional certifications?",
            "answer": "Traditional certifications are static and often outdated. Proof Scores are dynamic, real-time measurements of actual work output and technical proficiency, updated continuously as you contribute to projects."
        }
    ]', '{"type": "json", "description": "Landing page FAQs array"}', NULL),

    -- Roadmap
    ('landing', 'roadmap', '[
        {
            "title": "Phase 1: Foundation",
            "status": "Completed",
            "icon": "Shield",
            "items": ["Core Verification Engine", "SkillProof Protocol", "Basic Talent Search", "Secure OAuth Integration"]
        },
        {
            "title": "Phase 2: Intelligence",
            "status": "In Progress",
            "icon": "Zap",
            "items": ["AI Proof Scoring v2", "Skill Resonance Matching", "Deterministic Assessments", "Ecosystem Integrations"]
        },
        {
            "title": "Phase 3: Scale",
            "status": "Upcoming",
            "icon": "Rocket",
            "items": ["Global Talent Marketplace", "Automated Payroll Sync", "Enterprise Whitelabeling", "Mobile Identity Node"]
        },
        {
            "title": "Phase 4: Ecosystem",
            "status": "Planned",
            "icon": "Globe",
            "items": ["Cross-Platform Verification", "Unified Reputation", "Universal Identity Hub", "Open Protocol API"]
        }
    ]', '{"type": "json", "description": "Landing page roadmap phases"}', NULL)

ON CONFLICT (section_key, content_key) 
DO UPDATE SET 
    content_value = EXCLUDED.content_value,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

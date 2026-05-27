INSERT INTO site_content (section_key, content_key, content_value, metadata, updated_by)
VALUES 
    -- Sectors (Categories)
    ('sectors', 'title', 'Intelligence Sectors', '{"type": "text", "description": "Title for the categories section"}', NULL),
    ('sectors', 'subtitle', 'Explore professional resonance across emerging technical stacks.', '{"type": "text", "description": "Subtitle for the categories section"}', NULL),
    ('sectors', 'list', '[
        { "name": "Software Engineering", "count": 1240, "icon": "Code2", "color": "indigo" },
        { "name": "AI & Neural Systems", "count": 850, "icon": "Cpu", "color": "purple" },
        { "name": "Infrastructure & NextGen", "count": 620, "icon": "Bitcoin", "color": "orange" }
    ]', '{"type": "json", "description": "List of categories"}', NULL),

    -- Features (Why Choose Us)
    ('features', 'title', 'The Verified Choice', '{"type": "text", "description": "Title for the features section"}', NULL),
    ('features', 'subtitle', 'We''ve discarded traditional hiring friction for verified cryptographic certainty.', '{"type": "text", "description": "Subtitle for the features section"}', NULL),
    ('features', 'cards', '[
        { "title": "Precision Verification", "description": "Verified proof of expertise through algorithmic skill assessments and real-world project validation.", "icon": "ShieldCheck" },
        { "title": "AI Match Resonance", "description": "Advanced AI analyzes technical data to find perfect matches with mathematical certainty and culture fit.", "icon": "Zap" },
        { "title": "Talent Marketplace", "description": "Access a global network of pre-vetted engineers and industry leaders ready for high-impact deployment.", "icon": "Users" },
        { "title": "Verified Requisitions", "description": "Companies are vetted for authenticity, ensuring every role you apply for is real and high-value.", "icon": "BadgeCheck" }
    ]', '{"type": "json", "description": "List of feature cards"}', NULL),

    -- Integrations
    ('landing', 'integrations_title', 'Seamless Integrations', '{"type": "text", "description": "Title for the integrations section"}', NULL),
    ('landing', 'integrations_subtitle', 'Connect your existing workflow with our platform. From automated skill verification to real-time sync with your HR stack.', '{"type": "text", "description": "Subtitle for the integrations section"}', NULL),
    ('landing', 'integrations', '[
        { "name": "Slack", "icon": "Slack", "color": "text-[#4A154B]" },
        { "name": "GitHub", "icon": "Github", "color": "text-[#181717]" },
        { "name": "Google", "icon": "Globe", "color": "text-[#4285F4]" },
        { "name": "Discord", "icon": "Cpu", "color": "text-[#5865F2]" },
        { "name": "PostgreSQL", "icon": "Layers", "color": "text-[#3ECF8E]" },
        { "name": "Postmark", "icon": "Mail", "color": "text-[#FF6B6B]" }
    ]', '{"type": "json", "description": "List of integrations"}', NULL),

    -- Featured Jobs Header
    ('landing', 'featured_jobs_title', 'Featured Requisitions', '{"type": "text", "description": "Title for the featured jobs section"}', NULL),
    ('landing', 'featured_jobs_subtitle', 'Top roles at verified professional organizations seeking high-fidelity talent.', '{"type": "text", "description": "Subtitle for the featured jobs section"}', NULL),

    -- Stats Labels
    ('stats', 'users_count_label', 'Verified Talent', '{"type": "text", "description": "Label for the users stat"}', NULL),
    ('stats', 'skills_verified_label', 'Verified Skills', '{"type": "text", "description": "Label for the skills stat"}', NULL),
    ('stats', 'companies_count_label', 'Active Companies', '{"type": "text", "description": "Label for the companies stat"}', NULL)

ON CONFLICT (section_key, content_key) 
DO UPDATE SET 
    content_value = EXCLUDED.content_value,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

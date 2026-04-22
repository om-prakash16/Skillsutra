-- CMS Infrastructure: Landing Page & Static Content Orchestration

-- SECTION 1: Site Content Registry
-- Table to store dynamic text, images, and SEO metadata for the platform.
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL, -- e.g. 'hero_section', 'stats_bar'
    content_key TEXT NOT NULL, -- e.g. 'title', 'subtitle', 'image_url'
    content_value TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- styling, font sizes, alt text
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT now(),
    updated_by UUID REFERENCES users(id),
    UNIQUE(section_key, content_key)
);

-- Index for high-performance lookup
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section_key);

-- SECTION 2: Seed Initial CMS Content
INSERT INTO site_content (section_key, content_key, content_value, metadata)
VALUES 
-- Branding & Global Elements
('global', 'site_name', 'SkillProof AI', '{}'),
('global', 'logo_url', '/logo.svg', '{"alt": "SkillProof AI Logo"}'),
('global', 'copyright', '© 2026 SkillProof AI. Standardizing the Decentralized Workforce.', '{}'),

-- SEO Metadata
('seo', 'default_title', 'SkillProof AI | Standardizing Global Talent', '{}'),
('seo', 'default_description', 'High-assurance career verification and sovereign professional identity for the decentralized hiring economy.', '{}'),
('seo', 'keywords', 'blockchain, ai hiring, solana, nft skills, web3 talent', '{}'),

-- Navbar Configuration
('navbar', 'links', '[{"label": "Jobs", "href": "/jobs"}, {"label": "Talent", "href": "/talent"}, {"label": "Verify", "href": "/verify"}]', '{"type": "link_list"}'),
('navbar', 'cta_label', 'Connect Wallet', '{}'),

-- Footer Configuration
('footer', 'columns', '[
    {"title": "Platform", "links": [{"label": "Marketplace", "href": "/jobs"}, {"label": "Post a Job", "href": "/post-job"}]},
    {"title": "Company", "links": [{"label": "About Us", "href": "/about"}, {"label": "Support", "href": "/support"}]},
    {"title": "Legal", "links": [{"label": "Privacy", "href": "/privacy"}, {"label": "Terms", "href": "/terms"}]}
]', '{"type": "column_list"}'),
('footer', 'social_links', '[{"platform": "twitter", "url": "https://twitter.com/skillproof"}, {"platform": "github", "url": "https://github.com/skillproof"}]', '{"type": "social_list"}'),

-- Hero Section
('hero', 'badge', 'The Future of Web3 Talent is Here', '{}'),
('hero', 'title', 'Verify Skills. Hire Intelligence.', '{}'),
('hero', 'subtitle', 'SkillProof AI uses Gemini 1.5 and Solana to verify professional expertise with on-chain precision. no more resume inflation.', '{}'),

-- Stats Section
('stats', 'users_count_label', 'Active Talent Profiles', '{}'),
('stats', 'companies_count_label', 'Hiring Partners', '{}'),
('stats', 'nfts_minted_label', 'Proof NFTs Minted', '{}'),

-- Features (Why Choose Us)
('features', 'title', 'The SkillProof Paradigm', '{}'),
('features', 'subtitle', 'We''ve discarded traditional hiring friction for verified cryptographic certainty.', '{}'),
('features', 'cards', '[
    {"title": "Precision Verification", "description": "On-chain proof of expertise verified through Solana-based NFT skill badges.", "icon": "ShieldCheck"},
    {"title": "AI Insights", "description": "Gemini 1.5 analyzes resumes and technical repo data to find perfect matches.", "icon": "Zap"},
    {"title": "Reputation Engine", "description": "Build a sovereign, cross-platform reputation that goes wherever you go.", "icon": "BarChart3"},
    {"title": "Global Talent", "description": "Connect with a distributed workforce spanning hundreds of countries.", "icon": "Users"}
]', '{"type": "feature_list"}'),

-- Market Sectors (Categories)
('sectors', 'title', 'Market Sectors', '{}'),
('sectors', 'subtitle', 'Explore hiring trends across emerging tech stacks.', '{}'),
('sectors', 'list', '[
    {"name": "Software Engineering", "count": 1240, "icon": "Code2", "color": "indigo"},
    {"name": "AI & Data Science", "count": 850, "icon": "Cpu", "color": "purple"},
    {"name": "Blockchain & Web3", "count": 620, "icon": "Bitcoin", "color": "orange"},
    {"name": "Product & Design", "count": 480, "icon": "Globe2", "color": "rose"},
    {"name": "Cybersecurity", "count": 320, "icon": "ShieldCheck", "color": "emerald"},
    {"name": "Growth & Analytics", "count": 210, "icon": "BarChart4", "color": "blue"}
]', '{"type": "sector_list"}')
ON CONFLICT (section_key, content_key) DO UPDATE SET content_value = EXCLUDED.content_value, metadata = EXCLUDED.metadata;

-- RLS Policies for Public Discovery
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'site_content' AND policyname = 'Public can view site content'
    ) THEN
        CREATE POLICY "Public can view site content" ON site_content
        FOR SELECT TO public USING (is_active = TRUE);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'site_content' AND policyname = 'Admins can manage site content'
    ) THEN
        CREATE POLICY "Admins can manage site content" ON site_content
        FOR ALL TO authenticated USING (
            EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = auth.uid() AND r.role_name = 'ADMIN'
            )
        );
    END IF;
END $$;

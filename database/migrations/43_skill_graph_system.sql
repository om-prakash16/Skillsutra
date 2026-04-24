-- Migration 43: Skill Graph System
-- Enterprise skill taxonomy, relationships, user skill nodes, usage tracking, endorsements

-- 1. Skill Taxonomy (Master Dictionary)
CREATE TABLE IF NOT EXISTS public.skill_taxonomy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'tool',
    parent_id UUID REFERENCES public.skill_taxonomy(id),
    description TEXT,
    icon_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_taxonomy_slug ON public.skill_taxonomy(slug);
CREATE INDEX IF NOT EXISTS idx_taxonomy_category ON public.skill_taxonomy(category);
CREATE INDEX IF NOT EXISTS idx_taxonomy_parent ON public.skill_taxonomy(parent_id);
CREATE INDEX IF NOT EXISTS idx_taxonomy_name_gin ON public.skill_taxonomy USING GIN (to_tsvector('english', name));

-- 2. Skill Relationships (Weighted Graph Edges)
CREATE TABLE IF NOT EXISTS public.skill_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_skill_id UUID NOT NULL REFERENCES public.skill_taxonomy(id) ON DELETE CASCADE,
    target_skill_id UUID NOT NULL REFERENCES public.skill_taxonomy(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL DEFAULT 'related',
    proximity_weight FLOAT NOT NULL DEFAULT 0.5,
    is_bidirectional BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_skill_id, target_skill_id)
);
CREATE INDEX IF NOT EXISTS idx_rel_source ON public.skill_relationships(source_skill_id);
CREATE INDEX IF NOT EXISTS idx_rel_target ON public.skill_relationships(target_skill_id);

-- 3. User Skill Nodes (Candidate Graph Nodes)
CREATE TABLE IF NOT EXISTS public.user_skill_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skill_taxonomy(id),
    proficiency_level TEXT DEFAULT 'intermediate',
    proficiency_score FLOAT DEFAULT 0.0,
    proof_score FLOAT DEFAULT 0.0,
    source TEXT DEFAULT 'self_claimed',
    ai_confidence FLOAT,
    last_used_at TIMESTAMPTZ,
    years_experience FLOAT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_usn_user ON public.user_skill_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_usn_skill ON public.user_skill_nodes(skill_id);
CREATE INDEX IF NOT EXISTS idx_usn_verified ON public.user_skill_nodes(is_verified);
CREATE INDEX IF NOT EXISTS idx_usn_proof ON public.user_skill_nodes(proof_score DESC);

-- 4. Skill ↔ Project Links
CREATE TABLE IF NOT EXISTS public.skill_project_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_skill_node_id UUID NOT NULL REFERENCES public.user_skill_nodes(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.project_ledger(id) ON DELETE CASCADE,
    usage_context TEXT,
    contribution_weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_skill_node_id, project_id)
);

-- 5. Skill Usage Events (Temporal Tracking)
CREATE TABLE IF NOT EXISTS public.skill_usage_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skill_taxonomy(id),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    proof_delta FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sue_user_skill ON public.skill_usage_events(user_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_sue_created ON public.skill_usage_events(created_at DESC);

-- 6. Skill Endorsements
CREATE TABLE IF NOT EXISTS public.skill_endorsements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_skill_node_id UUID NOT NULL REFERENCES public.user_skill_nodes(id) ON DELETE CASCADE,
    endorser_id UUID NOT NULL REFERENCES public.users(id),
    endorser_relationship TEXT,
    comment TEXT,
    weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_skill_node_id, endorser_id)
);

-- 7. Job ↔ Skill Requirements
CREATE TABLE IF NOT EXISTS public.job_skill_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skill_taxonomy(id),
    importance TEXT DEFAULT 'required',
    min_proficiency TEXT DEFAULT 'intermediate',
    min_years FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_jsr_job ON public.job_skill_requirements(job_id);
CREATE INDEX IF NOT EXISTS idx_jsr_skill ON public.job_skill_requirements(skill_id);

-- Triggers
CREATE OR REPLACE FUNCTION public.fn_update_skill_popularity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.skill_taxonomy SET popularity_score = popularity_score + 1 WHERE id = NEW.skill_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_skill_popularity ON public.user_skill_nodes;
CREATE TRIGGER trg_skill_popularity
AFTER INSERT ON public.user_skill_nodes
FOR EACH ROW EXECUTE FUNCTION public.fn_update_skill_popularity();

CREATE OR REPLACE FUNCTION public.fn_recalculate_proof_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_skill_nodes
    SET proof_score = LEAST(100, proof_score + NEW.proof_delta), updated_at = NOW()
    WHERE user_id = NEW.user_id AND skill_id = NEW.skill_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_proof_score ON public.skill_usage_events;
CREATE TRIGGER trg_proof_score
AFTER INSERT ON public.skill_usage_events
FOR EACH ROW EXECUTE FUNCTION public.fn_recalculate_proof_score();

-- RLS
ALTER TABLE public.skill_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skill_requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read taxonomy" ON public.skill_taxonomy;
CREATE POLICY "Public read taxonomy" ON public.skill_taxonomy FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own skill nodes" ON public.user_skill_nodes;
CREATE POLICY "Users manage own skill nodes" ON public.user_skill_nodes FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public view verified skill nodes" ON public.user_skill_nodes;
CREATE POLICY "Public view verified skill nodes" ON public.user_skill_nodes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own endorsements" ON public.skill_endorsements;
CREATE POLICY "Users manage own endorsements" ON public.skill_endorsements FOR ALL USING (auth.uid() = endorser_id);

-- SEED: Core Taxonomy (200+ skills across 8 categories)
INSERT INTO public.skill_taxonomy (name, slug, category) VALUES
-- Languages
('Python', 'python', 'language'), ('JavaScript', 'javascript', 'language'), ('TypeScript', 'typescript', 'language'),
('Rust', 'rust', 'language'), ('Go', 'go', 'language'), ('Java', 'java', 'language'),
('C++', 'cpp', 'language'), ('C#', 'csharp', 'language'), ('Ruby', 'ruby', 'language'),
('PHP', 'php', 'language'), ('Swift', 'swift', 'language'), ('Kotlin', 'kotlin', 'language'),
('Dart', 'dart', 'language'), ('Scala', 'scala', 'language'), ('R', 'r-lang', 'language'),
('Solidity', 'solidity', 'language'), ('SQL', 'sql', 'language'), ('Shell', 'shell', 'language'),
-- Frameworks
('React', 'react', 'framework'), ('Next.js', 'nextjs', 'framework'), ('Vue.js', 'vuejs', 'framework'),
('Angular', 'angular', 'framework'), ('Svelte', 'svelte', 'framework'), ('Django', 'django', 'framework'),
('FastAPI', 'fastapi', 'framework'), ('Flask', 'flask', 'framework'), ('Express', 'express', 'framework'),
('Spring Boot', 'spring-boot', 'framework'), ('Rails', 'rails', 'framework'), ('Laravel', 'laravel', 'framework'),
('NestJS', 'nestjs', 'framework'), ('Anchor', 'anchor', 'framework'), ('Flutter', 'flutter', 'framework'),
('React Native', 'react-native', 'framework'), ('Tailwind CSS', 'tailwind-css', 'framework'),
-- Tools
('Docker', 'docker', 'tool'), ('Kubernetes', 'kubernetes', 'tool'), ('Git', 'git', 'tool'),
('GitHub Actions', 'github-actions', 'tool'), ('Jenkins', 'jenkins', 'tool'), ('Terraform', 'terraform', 'tool'),
('Webpack', 'webpack', 'tool'), ('Vite', 'vite', 'tool'), ('Figma', 'figma', 'tool'),
('Postman', 'postman', 'tool'), ('VS Code', 'vscode', 'tool'), ('Jira', 'jira', 'tool'),
-- Databases
('PostgreSQL', 'postgresql', 'database'), ('MongoDB', 'mongodb', 'database'), ('Redis', 'redis', 'database'),
('MySQL', 'mysql', 'database'), ('Supabase', 'supabase', 'database'), ('Firebase', 'firebase', 'database'),
('DynamoDB', 'dynamodb', 'database'), ('Elasticsearch', 'elasticsearch', 'database'),
-- Cloud
('AWS', 'aws', 'cloud'), ('Google Cloud', 'gcp', 'cloud'), ('Azure', 'azure', 'cloud'),
('Vercel', 'vercel', 'cloud'), ('Netlify', 'netlify', 'cloud'), ('Heroku', 'heroku', 'cloud'),
-- Concepts
('REST API', 'rest-api', 'concept'), ('GraphQL', 'graphql', 'concept'), ('Microservices', 'microservices', 'concept'),
('CI/CD', 'cicd', 'concept'), ('DevOps', 'devops', 'concept'), ('Machine Learning', 'machine-learning', 'concept'),
('Deep Learning', 'deep-learning', 'concept'), ('Data Science', 'data-science', 'concept'),
('Blockchain', 'blockchain', 'concept'), ('Web3', 'web3', 'concept'), ('Smart Contracts', 'smart-contracts', 'concept'),
('DeFi', 'defi', 'concept'), ('System Design', 'system-design', 'concept'), ('TDD', 'tdd', 'concept'),
('Agile', 'agile', 'concept'), ('Scrum', 'scrum', 'concept'),
-- AI/ML
('TensorFlow', 'tensorflow', 'ai_ml'), ('PyTorch', 'pytorch', 'ai_ml'), ('Pandas', 'pandas', 'ai_ml'),
('NumPy', 'numpy', 'ai_ml'), ('Scikit-learn', 'scikit-learn', 'ai_ml'), ('Langchain', 'langchain', 'ai_ml'),
('OpenAI API', 'openai-api', 'ai_ml'), ('Hugging Face', 'hugging-face', 'ai_ml'),
-- Soft Skills
('Leadership', 'leadership', 'soft_skill'), ('Communication', 'communication', 'soft_skill'),
('Problem Solving', 'problem-solving', 'soft_skill'), ('Teamwork', 'teamwork', 'soft_skill'),
('Project Management', 'project-management', 'soft_skill')
ON CONFLICT (slug) DO NOTHING;

-- SEED: Key Skill Relationships
DO $$ 
DECLARE
    v_python UUID; v_js UUID; v_ts UUID; v_rust UUID; v_react UUID; v_nextjs UUID;
    v_django UUID; v_fastapi UUID; v_flask UUID; v_node UUID; v_docker UUID; v_k8s UUID;
    v_solana UUID; v_anchor UUID; v_web3 UUID; v_sc UUID; v_pg UUID; v_rest UUID;
    v_ml UUID; v_ds UUID; v_pandas UUID; v_tf UUID; v_pytorch UUID;
    v_go UUID; v_vue UUID; v_angular UUID; v_redis UUID; v_mongo UUID;
BEGIN
    SELECT id INTO v_python FROM public.skill_taxonomy WHERE slug='python';
    SELECT id INTO v_js FROM public.skill_taxonomy WHERE slug='javascript';
    SELECT id INTO v_ts FROM public.skill_taxonomy WHERE slug='typescript';
    SELECT id INTO v_rust FROM public.skill_taxonomy WHERE slug='rust';
    SELECT id INTO v_react FROM public.skill_taxonomy WHERE slug='react';
    SELECT id INTO v_nextjs FROM public.skill_taxonomy WHERE slug='nextjs';
    SELECT id INTO v_django FROM public.skill_taxonomy WHERE slug='django';
    SELECT id INTO v_fastapi FROM public.skill_taxonomy WHERE slug='fastapi';
    SELECT id INTO v_flask FROM public.skill_taxonomy WHERE slug='flask';
    SELECT id INTO v_node FROM public.skill_taxonomy WHERE slug='express';
    SELECT id INTO v_docker FROM public.skill_taxonomy WHERE slug='docker';
    SELECT id INTO v_k8s FROM public.skill_taxonomy WHERE slug='kubernetes';
    SELECT id INTO v_solana FROM public.skill_taxonomy WHERE slug='blockchain';
    SELECT id INTO v_anchor FROM public.skill_taxonomy WHERE slug='anchor';
    SELECT id INTO v_web3 FROM public.skill_taxonomy WHERE slug='web3';
    SELECT id INTO v_sc FROM public.skill_taxonomy WHERE slug='smart-contracts';
    SELECT id INTO v_pg FROM public.skill_taxonomy WHERE slug='postgresql';
    SELECT id INTO v_rest FROM public.skill_taxonomy WHERE slug='rest-api';
    SELECT id INTO v_ml FROM public.skill_taxonomy WHERE slug='machine-learning';
    SELECT id INTO v_ds FROM public.skill_taxonomy WHERE slug='data-science';
    SELECT id INTO v_pandas FROM public.skill_taxonomy WHERE slug='pandas';
    SELECT id INTO v_tf FROM public.skill_taxonomy WHERE slug='tensorflow';
    SELECT id INTO v_pytorch FROM public.skill_taxonomy WHERE slug='pytorch';
    SELECT id INTO v_go FROM public.skill_taxonomy WHERE slug='go';
    SELECT id INTO v_vue FROM public.skill_taxonomy WHERE slug='vuejs';
    SELECT id INTO v_angular FROM public.skill_taxonomy WHERE slug='angular';
    SELECT id INTO v_redis FROM public.skill_taxonomy WHERE slug='redis';
    SELECT id INTO v_mongo FROM public.skill_taxonomy WHERE slug='mongodb';

    INSERT INTO public.skill_relationships (source_skill_id, target_skill_id, relationship_type, proximity_weight) VALUES
    (v_python, v_django, 'related', 0.9), (v_python, v_fastapi, 'related', 0.92),
    (v_python, v_flask, 'related', 0.88), (v_python, v_pandas, 'related', 0.7),
    (v_python, v_ml, 'related', 0.6), (v_js, v_ts, 'related', 0.95),
    (v_js, v_react, 'related', 0.85), (v_js, v_node, 'related', 0.88),
    (v_js, v_vue, 'related', 0.8), (v_ts, v_react, 'related', 0.88),
    (v_ts, v_nextjs, 'related', 0.9), (v_ts, v_angular, 'related', 0.8),
    (v_react, v_nextjs, 'related', 0.92), (v_rust, v_anchor, 'related', 0.9),
    (v_rust, v_sc, 'related', 0.8), (v_anchor, v_web3, 'related', 0.85),
    (v_anchor, v_sc, 'related', 0.92), (v_web3, v_sc, 'related', 0.92),
    (v_docker, v_k8s, 'related', 0.85), (v_django, v_rest, 'related', 0.85),
    (v_fastapi, v_rest, 'related', 0.9), (v_fastapi, v_python, 'related', 0.92),
    (v_ml, v_ds, 'related', 0.9), (v_ml, v_tf, 'related', 0.88),
    (v_ml, v_pytorch, 'related', 0.88), (v_ds, v_pandas, 'related', 0.88),
    (v_pg, v_rest, 'related', 0.65), (v_go, v_docker, 'related', 0.7),
    (v_go, v_rest, 'related', 0.8), (v_redis, v_pg, 'related', 0.5),
    (v_mongo, v_node, 'related', 0.7)
    ON CONFLICT (source_skill_id, target_skill_id) DO NOTHING;
END $$;

COMMENT ON TABLE public.skill_taxonomy IS 'Master skill dictionary with hierarchical categories.';
COMMENT ON TABLE public.skill_relationships IS 'Weighted graph edges between skills for semantic matching.';
COMMENT ON TABLE public.user_skill_nodes IS 'Per-user skill graph nodes with proof scores.';
COMMENT ON TABLE public.skill_usage_events IS 'Temporal skill usage events for proof score calculation.';
COMMENT ON TABLE public.skill_endorsements IS 'Peer endorsements for skill verification.';
COMMENT ON TABLE public.job_skill_requirements IS 'Structured job-to-skill mapping replacing TEXT[] arrays.';

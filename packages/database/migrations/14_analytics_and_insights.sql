-- 14_analytics_and_insights.sql
-- Enterprise-grade Analytics and Insights Infrastructure

-- 1. Raw Event Stream (High-frequency)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    entity_type TEXT, -- e.g., 'job', 'application', 'quiz'
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Aggregated Metrics (Optimized for Reporting)
CREATE TABLE IF NOT EXISTS public.aggregated_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    dimension_key TEXT, -- e.g., 'skill_name', 'job_category'
    dimension_value TEXT,
    period TEXT CHECK (period IN ('hourly', 'daily', 'weekly', 'monthly')),
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE (metric_name, dimension_key, dimension_value, period, period_start)
);

-- 3. Indexes for fast discovery and aggregation
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_metadata ON public.analytics_events USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_aggregated_metrics_name ON public.aggregated_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_aggregated_metrics_period ON public.aggregated_metrics(period, period_start);

-- 4. Row Level Security (RLS)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregated_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view ALL analytics
CREATE POLICY "Admins can view all analytics" 
ON public.analytics_events FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.staff_assignments sa
    JOIN public.staff_roles sr ON sa.role_id = sr.id
    WHERE sa.user_id = auth.uid() AND sr.role_name IN ('admin', 'superadmin')
));

-- Policy: Users can view their OWN analytics events
CREATE POLICY "Users can view own analytics" 
ON public.analytics_events FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Public aggregated metrics (Global non-sensitive data)
CREATE POLICY "Anyone can view global aggregates" 
ON public.aggregated_metrics FOR SELECT 
USING (TRUE);

-- 5. Automated Aggregation Trigger: Daily KPIs
CREATE OR REPLACE FUNCTION aggregate_daily_system_kpis() RETURNS void AS $$
BEGIN
    -- 1. Daily User Growth
    INSERT INTO public.aggregated_metrics (metric_name, metric_value, period, period_start)
    SELECT 'daily_new_users', COUNT(*), 'daily', date_trunc('day', created_at)
    FROM public.users WHERE created_at >= date_trunc('day', NOW() - INTERVAL '1 day') GROUP BY 4
    ON CONFLICT (metric_name, dimension_key, dimension_value, period, period_start) DO UPDATE SET metric_value = EXCLUDED.metric_value;

    -- 2. Average Proof Score (Total System)
    INSERT INTO public.aggregated_metrics (metric_name, metric_value, period, period_start)
    SELECT 'avg_proof_score', AVG(proof_score), 'daily', date_trunc('day', NOW())
    FROM public.ai_scores
    ON CONFLICT (metric_name, dimension_key, dimension_value, period, period_start) DO UPDATE SET metric_value = EXCLUDED.metric_value;

    -- 3. NFT Mint Volume
    INSERT INTO public.aggregated_metrics (metric_name, metric_value, period, period_start)
    SELECT 'daily_nft_mints', COUNT(*), 'daily', date_trunc('day', created_at)
    FROM public.nft_records WHERE created_at >= date_trunc('day', NOW() - INTERVAL '1 day') GROUP BY 4
    ON CONFLICT (metric_name, dimension_key, dimension_value, period, period_start) DO UPDATE SET metric_value = EXCLUDED.metric_value;
END
$$ LANGUAGE plpgsql;

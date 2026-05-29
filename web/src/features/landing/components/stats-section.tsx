'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api/api-client';
import { Activity, ShieldCheck, Database, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function StatsSection() {
  const [stats, setStats] = useState([
    { label: 'Verified Talent', value: '12,450', metric: 'Node connections: Active', icon: ShieldCheck, trend: 'Confidence Score: Stable' },
    { label: 'Verified Skills', value: '8,920', metric: 'Tamper-proof ledger', icon: Database, trend: 'Block sync latency: 1.4s' },
    { label: 'Active Companies', value: '432', metric: 'Ecosystem org nodes', icon: Activity, trend: 'Verification throughput: Stable' },
    { label: 'AI Verifications', value: '15k+', metric: 'Gemini Agent reasoning', icon: Cpu, trend: 'Resonance matching accuracy: 98.4%' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const cmsData = await api.cms.section('stats');
        const adminAnalytics = await api.analytics.admin();

        const newStats = [...stats];

        if (adminAnalytics) {
          if (adminAnalytics.total_users) newStats[0].value = adminAnalytics.total_users.toLocaleString();
          if (adminAnalytics.total_nfts) newStats[1].value = adminAnalytics.total_nfts.toLocaleString();
          if (adminAnalytics.total_companies) newStats[2].value = adminAnalytics.total_companies.toLocaleString();
        }

        if (Array.isArray(cmsData)) {
          cmsData.forEach(item => {
            if (item.content_key === 'users_count_label') newStats[0].label = item.content_value;
            if (item.content_key === 'skills_verified_label') newStats[1].label = item.content_value;
            if (item.content_key === 'companies_count_label') newStats[2].label = item.content_value;
          });
        }

        setStats(newStats);
      } catch (e) {
        console.error("Stats Sync Failed:", e);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="bg-background py-24 relative overflow-hidden border-b border-border/50">
      {/* Visual background atmospheric orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        
        {/* Telemetry Control Center Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-4 py-1.5 rounded-full">
              NETWORK TELEMETRY
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Ecosystem <span className="text-primary italic font-black">Sync Statistics</span>
            </h2>
          </div>
          <div className="flex items-center gap-3.5 px-4.5 py-2 glass rounded-2xl border-border/50 bg-[#12121a]/30">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-micro font-bold text-emerald-500">RESONANCE SYNC ACTIVE (14ms LATENCY)</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass border-border/50 bg-[#12121a]/30 p-8 rounded-3xl relative overflow-hidden group shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:border-primary/20"
              >
                {/* Subtle top light overlay glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="space-y-6">
                  {/* Icon & active tag */}
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform ease-premium-out duration-300">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#10b981] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      LIVE_NODE
                    </span>
                  </div>

                  {/* Main stat counter */}
                  <div className="space-y-1">
                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground block font-heading">
                      {stat.value}
                    </span>
                    <span className="text-micro font-bold text-muted-foreground/60 uppercase tracking-widest block">
                      {stat.label}
                    </span>
                  </div>

                  <div className="h-px bg-muted/50 w-full" />

                  {/* Telemetry line details */}
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-muted-foreground/80">{stat.metric}</p>
                    <p className="text-[10px] font-mono text-primary/70">{stat.trend}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

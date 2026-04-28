'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api/api-client';

export function StatsSection() {
  const [stats, setStats] = useState([
    { label: 'Verified Talent', value: '12,450' },
    { label: 'Skill NFTs Minted', value: '8,920' },
    { label: 'Active Companies', value: '432' },
    { label: 'AI Verifications', value: '15k+' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch CMS Overrides
        const cmsData = await api.cms.section('stats');
        const adminAnalytics = await api.analytics.admin();

        const newStats = [...stats];

        // Map live analytics if available
        if (adminAnalytics) {
            if (adminAnalytics.total_users) newStats[0].value = adminAnalytics.total_users.toLocaleString();
            if (adminAnalytics.total_nfts) newStats[1].value = adminAnalytics.total_nfts.toLocaleString();
            if (adminAnalytics.total_companies) newStats[2].value = adminAnalytics.total_companies.toLocaleString();
        }

        // Apply CMS Label Overrides
        if (Array.isArray(cmsData)) {
            cmsData.forEach(item => {
                if (item.content_key === 'users_count_label') newStats[0].label = item.content_value;
                if (item.content_key === 'nfts_minted_label') newStats[1].label = item.content_value;
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
    <section className="bg-primary/90 backdrop-blur-3xl pt-16 pb-24 relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_40%)] pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl px-6 flex flex-wrap justify-between items-center gap-12 relative z-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col space-y-2 group"
          >
            <span className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-2xl transition-transform group-hover:scale-105 duration-500">
                {stat.value}
            </span>
            <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-white/20 group-hover:w-12 transition-all duration-500" />
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/50 group-hover:text-white transition-colors duration-500">
                    {stat.label}
                </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Zap, Code2, Globe, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
    id: string;
    year: string;
    title: string;
    description: string;
    type: 'verified' | 'learning' | 'achievement' | 'deployment';
    tech?: string[];
}

interface SkillTimelineProps {
    events?: TimelineEvent[];
    className?: string;
}

const defaultEvents: TimelineEvent[] = [
    {
        id: '1',
        year: '2021',
        title: 'Fullstack Genesis',
        description: 'First production-grade Next.js application deployed to Vercel.',
        type: 'deployment',
        tech: ['Next.js', 'PostgreSQL']
    },
    {
        id: '2',
        year: '2022',
        title: 'Solana Ecosystem Entry',
        description: 'Certified Rust & Anchor developer via Best Hiring Tool AI Forensics.',
        type: 'verified',
        tech: ['Rust', 'Anchor', 'Solana']
    },
    {
        id: '3',
        year: '2023',
        title: 'AI Intelligence Architect',
        description: 'Implemented multi-agent LLM systems for enterprise talent sourcing.',
        type: 'achievement',
        tech: ['LangChain', 'OpenAI', 'Python']
    },
    {
        id: '4',
        year: '2024',
        title: 'Lead Protocol Engineer',
        description: 'Architected the core verification layer for The Best Hiring Tool.',
        type: 'verified',
        tech: ['TypeScript', 'FastAPI', 'Supabase']
    }
];

const icons = {
    verified: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    learning: <Code2 className="w-5 h-5 text-blue-400" />,
    achievement: <Award className="w-5 h-5 text-amber-400" />,
    deployment: <Globe className="w-5 h-5 text-purple-400" />
};

const colors = {
    verified: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    learning: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
    achievement: 'from-amber-500/20 to-amber-500/5 border-amber-500/20',
    deployment: 'from-purple-500/20 to-purple-500/5 border-purple-500/20'
};

export function SkillTimeline({ events = defaultEvents, className }: SkillTimelineProps) {
    return (
        <div className={cn("relative py-10 px-4", className)}>
            {/* The Central Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden md:block" />
            
            <div className="space-y-12 md:space-y-0 relative z-10">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20, x: index % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={cn(
                            "flex flex-col md:flex-row items-center w-full mb-8 md:mb-20",
                            index % 2 === 0 ? "md:flex-row-reverse" : ""
                        )}
                    >
                        {/* Dot on line */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)] z-20 hidden md:block" />

                        {/* Content Card */}
                        <div className="w-full md:w-[45%]">
                            <div className={cn(
                                "p-6 rounded-2xl border backdrop-blur-xl bg-gradient-to-br shadow-xl group hover:scale-[1.02] transition-all duration-300",
                                colors[event.type]
                            )}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xs font-black uppercase tracking-[0.3em] text-white/40 font-mono">
                                        {event.year}
                                    </div>
                                    <div className="bg-white/10 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                                        {icons[event.type]}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    {event.description}
                                </p>
                                
                                {event.tech && (
                                    <div className="flex flex-wrap gap-2">
                                        {event.tech.map(t => (
                                            <span key={t} className="px-2 py-0.5 text-[10px] rounded bg-white/5 border border-white/10 text-white/60">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Spacer for flow */}
                        <div className="hidden md:block w-[10%]" />
                    </motion.div>
                ))}
            </div>

            {/* Decorative Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />
        </div>
    );
}

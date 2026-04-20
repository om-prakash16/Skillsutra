'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Target, TrendingUp, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Milestone {
    id: string;
    role: string;
    timeframe: string;
    requirement: string;
    probability: number;
    description: string;
}

const mockMilestones: Milestone[] = [
    {
        id: 'ms1',
        role: 'Senior Protocol Architect',
        timeframe: '6-12 Months',
        requirement: 'Master Zero-Knowledge Proofs (ZKP)',
        probability: 92,
        description: 'Lead high-throughput privacy-preserving blockchain layers.'
    },
    {
        id: 'ms2',
        role: 'AI Infrastructure Lead',
        timeframe: '18-24 Months',
        requirement: 'Multi-Agent Orchestration Specialist',
        probability: 85,
        description: 'Design the neural backbone for autonomous hiring agents.'
    },
    {
        id: 'ms3',
        role: 'Chief Technical Officer',
        timeframe: '3-5 Years',
        requirement: 'Strategic Ecosystem Leadership',
        probability: 65,
        description: 'Drive global adoption of decentralized talent verification protocols.'
    }
];

export function CareerSimulator() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [simulating, setSimulating] = useState(false);

    const handleRunSimulation = () => {
        setSimulating(true);
        setTimeout(() => {
            setSimulating(false);
            setActiveIndex((prev) => (prev + 1) % mockMilestones.length);
        }, 2000);
    };

    return (
        <div className="relative p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-2xl overflow-hidden min-h-[450px] flex flex-col">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/20 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col h-full flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest">
                            <Cpu className="w-4 h-4" /> Neural Predictor v4.0
                        </div>
                        <h2 className="text-2xl font-black text-white">Career Path Simulator</h2>
                    </div>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleRunSimulation}
                        disabled={simulating}
                        className="bg-white/5 border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all scale-90"
                    >
                        {simulating ? 'Processing Neural Data...' : 'Rerun Simulation'}
                    </Button>
                </div>

                <div className="flex-1 grid md:grid-cols-[1fr_2fr] gap-8">
                    {/* Progress indicators */}
                    <div className="flex flex-col justify-center gap-4">
                        {mockMilestones.map((ms, idx) => (
                            <div 
                                key={ms.id}
                                className={cn(
                                    "p-4 rounded-xl border transition-all duration-500 flex items-center gap-4 cursor-pointer",
                                    activeIndex === idx 
                                        ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] scale-105" 
                                        : "bg-white/5 border-white/5 opacity-40 hover:opacity-100"
                                )}
                                onClick={() => setActiveIndex(idx)}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    activeIndex === idx ? "bg-primary text-white" : "bg-white/10"
                                )}>
                                    {idx === 0 ? <TrendingUp className="w-5 h-5" /> : idx === 1 ? <Target className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40">{ms.timeframe}</p>
                                    <p className="text-sm font-bold truncate">{ms.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Milestone Display */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex + (simulating ? 'sim' : 'idle')}
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col justify-center relative group"
                        >
                            {simulating ? (
                                <div className="h-full w-full flex flex-col items-center justify-center gap-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Cpu className="text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white mb-1">Synthesizing Skills...</p>
                                        <p className="text-xs text-muted-foreground uppercase font-black tracking-tighter">Matching profile against market velocity</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute top-4 right-6 text-5xl font-black text-white/5 italic">0{activeIndex + 1}</div>
                                    
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{mockMilestones[activeIndex].timeframe} Horizon</p>
                                            <h3 className="text-3xl font-black text-white">{mockMilestones[activeIndex].role}</h3>
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed">
                                            {mockMilestones[activeIndex].description}
                                        </p>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold uppercase text-white/40">Probability Score</span>
                                                <span className="font-black text-primary">{mockMilestones[activeIndex].probability}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${mockMilestones[activeIndex].probability}%` }}
                                                    className="h-full bg-gradient-to-r from-primary to-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                            <p className="text-[10px] uppercase font-black text-primary/60 mb-1">Critical Requirement</p>
                                            <p className="text-sm font-bold text-white flex items-center gap-2">
                                                <ArrowRight className="w-4 h-4" /> {mockMilestones[activeIndex].requirement}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldCheck, TerminalSquare } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { api, API_BASE_URL } from '@/lib/api/api-client';

export function HeroSection() {
  const [content, setContent] = useState<any>({
    title: 'Verify Skills. Hire Intelligence.',
    subtitle: 'The best hiring tool uses Gemini 1.5 and Solana to verify professional expertise with on-chain precision. No more resume inflation.',
    badge: 'The Future of Web3 Talent is Here'
  });
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cms/hero`);
        if (response.ok) {
           const data = await response.json();
           if (Array.isArray(data)) {
             const mapped = data.reduce((acc: any, item: any) => {
               acc[item.content_key] = item.content_value;
               return acc;
             }, {});
             if (Object.keys(mapped).length > 0) setContent((prev: any) => ({ ...prev, ...mapped }));
           }
        }
      } catch (e) {
        console.error("CMS Sync Failed:", e);
      }
    };
    fetchHero();
    
    // Terminal Log streaming sequence
    const fetchLogs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/ai/verification-stream-demo`);
            if (res.ok) {
                const logs = await res.json();
                let i = 0;
                const interval = setInterval(() => {
                    if (i < logs.length) {
                        setTerminalLogs(prev => [...prev, logs[i++]]);
                        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    } else {
                        clearInterval(interval);
                    }
                }, 800);
                return () => clearInterval(interval);
            }
        } catch(e) {
            // Mock fallback if backend isn't ready
            const mockLogs = [
                "> INITIALIZING NEURAL ENGINE...",
                "> CONNECTING TO SOLANA DEVNET...",
                "> PARSING RESUME AST...",
                "> EXTRACTING RUST COMPETENCY VERIFICATION...",
                "> MATCHING GITHUB COMMITS TO CLAIMED EXPERIENCE...",
                "> [SUCCESS] 98% MATCH CONFIDENCE",
                "> MINTING SOULBOUND TOKEN..."
            ];
            let i = 0;
            const interval = setInterval(() => {
                if (i < mockLogs.length) {
                    setTerminalLogs(prev => [...prev, mockLogs[i++]]);
                    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                } else clearInterval(interval);
            }, 800);
            return () => clearInterval(interval);
        }
    };
    const cleanup = fetchLogs();
    return () => { cleanup.then(c => c && c()) };
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 px-4 overflow-hidden bg-background flex flex-col justify-center">
      {/* Deep Space Glassmorphic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[150px] rounded-full mix-blend-screen opacity-50" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Typography & CTA */}
        <div className="space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary text-xs font-black uppercase tracking-widest backdrop-blur-xl"
          >
            <Sparkles className="w-3 h-3" />
            {content.badge}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-heading tracking-tight text-foreground leading-[1.1]"
          >
            {content.title.split('.').map((part: string, i: number) => (
              <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic" : ""}>
                {part}{i === 0 && "."} {i === 0 && <br />}
              </span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-large text-muted-foreground max-w-xl"
          >
            {content.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 whitespace-nowrap"
          >
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black tracking-wide shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:scale-[1.02] transition-all">
                Discover Jobs <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/verify" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all text-foreground hover:border-primary/50">
                Verify My Skills
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center gap-6 pt-8 text-sm font-bold text-muted-foreground uppercase tracking-widest"
          >
            <div className="flex flex-col gap-1 items-start"><span className="text-foreground text-2xl">4.9M+</span><span className="text-[10px]">Verifications</span></div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col gap-1 items-start"><span className="text-foreground text-2xl">12k+</span><span className="text-[10px]">Hired Talent</span></div>
          </motion.div>
        </div>

        {/* Right Side: The Terminal Mockup */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
           animate={{ opacity: 1, scale: 1, rotateY: 0 }}
           transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
           style={{ perspective: 1000 }}
           className="relative mx-auto w-full max-w-lg hidden lg:block"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-30 animate-pulse" />
            <div className="relative h-[500px] w-full rounded-[2.5rem] bg-black/80 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/70">
                        <TerminalSquare className="w-4 h-4" /> Nexus Terminal
                    </div>
                    <div className="w-16" /> {/* spacer for center alignment */}
                </div>
                
                <div ref={scrollRef} className="flex-1 p-6 font-mono text-sm flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                    <AnimatePresence>
                        {terminalLogs.map((log, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`
                                    ${log?.includes?.('[SUCCESS]') ? 'text-primary font-bold' : 'text-neutral-400'}
                                    ${log?.includes?.('[ERROR]') ? 'text-destructive font-bold' : ''}
                                `}
                            >
                                {log}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {terminalLogs.length > 0 && <span className="w-2 h-4 bg-primary animate-pulse inline-block mt-2" />}
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">AI Engine Active</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Waiting for parameters...</p>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
}

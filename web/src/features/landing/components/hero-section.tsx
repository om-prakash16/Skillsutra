'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldCheck, TerminalSquare } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useCMS } from '@/context/cms-context';

export function HeroSection() {
  const { getVal } = useCMS();
  
  const content = {
    title: getVal('hero', 'title', 'The Proof Engine. The Ultimate Talent.'),
    subtitle: getVal('hero', 'subtitle', 'Verified Identity utilizes AI-driven intelligence and proof-of-work protocols to verify professional competence with mathematical precision. No more resume noise.'),
    badge: getVal('hero', 'badge', 'The Paradigm Shift in Talent Verification')
  };

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Initializing Verified Identity Protocol v4.0.0...",
    "Connecting to Intelligence Nodes...",
    "Ready for AI verification."
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const logs = [
          "Analyzing professional proof repositories...",
          "Decrypting verifiable credentials...",
          "Running AI heuristic match engine...",
          "Resonance matching: 98.4%",
          "[SUCCESS] Identity Verified & Authenticated.",
          "Generating Skill Verification Score...",
          "Secure Nexus link established.",
      ];
      
      let currentIdx = 0;
      const interval = setInterval(() => {
          if (currentIdx < logs.length) {
              setTerminalLogs(prev => [...prev, logs[currentIdx]]);
              currentIdx++;
          } else {
              clearInterval(interval);
          }
      }, 2000);

      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden bg-background flex flex-col justify-center">
      {/* Deep Space Glassmorphic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full mix-blend-screen opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[180px] rounded-full mix-blend-screen opacity-40" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Typography & CTA */}
        <div className="space-y-10 text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass text-primary text-micro font-bold tracking-widest backdrop-blur-2xl"
          >
            <Sparkles className="w-4 h-4" />
            {content.badge}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl font-extrabold font-heading tracking-tight text-foreground leading-[1.05]"
          >
            {content.title.split('.').map((part: string, i: number) => (
              <span key={i} className={i === 1 ? "text-gradient italic font-black" : ""}>
                {part}{i === 0 && "."} {i === 0 && <br />}
              </span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-normal"
          >
            {content.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-6 whitespace-nowrap"
          >
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button size="lg" variant="premium" className="w-full sm:w-auto h-14 px-8 rounded-xl shadow-premium group text-xs font-bold tracking-widest">
                DISCOVER JOBS <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/verify" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest hover:border-primary/50 transition-all">
                Verify My Skills
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center gap-10 pt-12 text-micro font-bold text-muted-foreground/40 uppercase tracking-widest"
          >
            <div className="flex flex-col gap-2 items-start"><span className="text-foreground text-4xl font-extrabold tracking-tighter">4.9M+</span><span>Verifications</span></div>
            <div className="w-px h-12 bg-black/10 dark:bg-white/5" />
            <div className="flex flex-col gap-2 items-start"><span className="text-foreground text-4xl font-extrabold tracking-tighter">12k+</span><span>Hired Talent</span></div>
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
                    <div className="flex items-center gap-2 text-micro font-bold text-primary/60">
                        <TerminalSquare className="w-4 h-4" /> Nexus Intelligence Terminal
                    </div>
                    <div className="w-16" />
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
                        <p className="text-micro text-muted-foreground font-bold">Waiting for parameters...</p>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
}

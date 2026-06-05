'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldCheck, TerminalSquare, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useCMS } from '@/context/cms-context';

export function HeroSection() {
  const { getVal } = useCMS();
  
  const content = {
    title: getVal('hero', 'title', 'Verify Skills. Hire Intelligence.'),
    subtitle: getVal('hero', 'subtitle', 'SkillSutra uses AI-driven Proof Scores and platform credentials to verify professional skills with mathematical precision. Stop screening resumes. Start hiring verified talent.'),
    badge: getVal('hero', 'badge', 'AI-Powered Talent Verification Platform')
  };

  // Terminal logic simulation
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Parallax tilt logic
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [8, -8]);
  const rotateY = useTransform(x, [-300, 300], [-8, 8]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = event.clientX - rect.left - width / 2;
      const mouseY = event.clientY - rect.top - height / 2;
      x.set(mouseX);
      y.set(mouseY);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  useEffect(() => {
    const scripts = [
      {
        prompt: "skillsutra verify --resume=cv_engineering.pdf",
        steps: [
          "[NODE_GATEWAY] Resolving trust node on network...",
          "[SHARDS_RESOLVED] Extracting cryptographic verified signatures...",
          "[ANALYZING] Evaluating Skill Resonance & Proof Shards...",
          "[SUCCESS] Integrity score generated: 98/100 (Verified)",
          "[REGISTRY_SYNC] Syncing record with Decentralized Reputation Ledger...",
          "[SYNCED] Shard synced to block #1,842,904"
        ]
      },
      {
        prompt: "skillsutra resonance-match --talent=priya_sharma --job=frontend_lead",
        steps: [
          "[RESONANCE] Loading vector skill embeddings...",
          "[ANALYSIS] Comparing JD requirements with verified profile nodes...",
          "[METRIC] Technical overlap: 97.4%",
          "[METRIC] Experience confidence: High",
          "[SUCCESS] Perfect match identified. Resonance score: 96%"
        ]
      }
    ];

    let scriptIndex = 0;
    let stepIndex = 0;
    let charIndex = 0;
    let currentLogs = ["Initializing SkillSutra Node v4.1.0-alpha...", "Connection status: NOMINAL (latency: 14ms)"];

    setTerminalLogs(currentLogs);

    let activeTimeout: NodeJS.Timeout;

    function runSimulation() {
      const activeScript = scripts[scriptIndex];
      
      if (charIndex <= activeScript.prompt.length) {
        setIsTyping(true);
        setCurrentPrompt("$ " + activeScript.prompt.slice(0, charIndex));
        charIndex++;
        activeTimeout = setTimeout(runSimulation, 50);
      } else if (stepIndex < activeScript.steps.length) {
        setIsTyping(false);
        const nextStep = activeScript.steps[stepIndex];
        currentLogs = [...currentLogs, nextStep];
        setTerminalLogs(currentLogs);
        stepIndex++;
        activeTimeout = setTimeout(runSimulation, 1000);
      } else {
        activeTimeout = setTimeout(() => {
          currentLogs = [
            "Initializing SkillSutra Node v4.1.0-alpha...",
            "Connection status: NOMINAL (latency: 14ms)"
          ];
          setTerminalLogs(currentLogs);
          charIndex = 0;
          stepIndex = 0;
          scriptIndex = (scriptIndex + 1) % scripts.length;
          runSimulation();
        }, 3500);
      }
    }

    const startTimer = setTimeout(runSimulation, 1200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(activeTimeout);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs, currentPrompt]);

  return (
    <section className="relative min-h-[92vh] pt-24 pb-16 px-4 overflow-hidden bg-background flex flex-col justify-center border-b border-border/50">
      {/* Grid Overlay Mask */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 80%)'
        }}
      />

      {/* Atmospheric Glow Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[45%] h-[45%] bg-primary/10 blur-[130px] rounded-full opacity-50 dark:opacity-40 animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[50%] h-[50%] bg-secondary/15 blur-[160px] rounded-full opacity-40 dark:opacity-30" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Typography & CTA */}
        <div className="space-y-8 text-left lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
            className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full border border-primary/10 bg-primary/5 text-primary text-micro font-bold tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {content.badge}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-extrabold font-heading tracking-tight text-foreground leading-[1.1] text-wrap:balance"
          >
            {content.title.split('.').map((part: string, i: number) => (
              <span key={i} className={i === 1 ? "text-gradient italic font-black" : ""}>
                {part}{i === 0 && "."} {i === 0 && <br className="hidden md:inline" />}
              </span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed font-normal"
          >
            {content.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 whitespace-nowrap"
          >
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button size="lg" variant="premium" className="w-full sm:w-auto h-12.5 px-7 rounded-xl shadow-premium group text-micro font-bold tracking-widest active-click">
                DISCOVER JOBS <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform ease-premium-out duration-200" />
              </Button>
            </Link>
            <Link href="/verify" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12.5 px-7 rounded-xl border-black/10 dark:border-border text-micro font-bold uppercase tracking-widest hover:border-primary/50 transition-all active-click">
                Verify My Skills
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-12 pt-8 text-micro font-bold text-muted-foreground/50 uppercase tracking-widest"
          >
            <div className="flex flex-col gap-1 items-start">
              <span className="text-foreground text-3xl font-extrabold tracking-tighter">4.9M+</span>
              <span>Identity Nodes</span>
            </div>
            <div className="w-px h-10 bg-black/10 dark:bg-muted/50" />
            <div className="flex flex-col gap-1 items-start">
              <span className="text-foreground text-3xl font-extrabold tracking-tighter">12k+</span>
              <span>Talent Synchronized</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive AI Terminal */}
        <motion.div
           initial={{ opacity: 0, scale: 0.96 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="lg:col-span-5 relative mx-auto w-full max-w-md hidden lg:block"
        >
          {/* Neon backdrop blur */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2rem] blur-2xl opacity-40 animate-pulse-glow" />
          
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            style={{ 
              rotateX: rotateX, 
              rotateY: rotateY, 
              transformStyle: "preserve-3d" 
            }}
            className="relative h-[440px] w-full rounded-[2rem] bg-card/90 dark:bg-background/90 backdrop-blur-3xl border border-border shadow-floating overflow-hidden flex flex-col transition-all duration-200 ease-out"
          >
            {/* Monitor Screen Glass Glare overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
            
            {/* Monitor Scanlines overlay */}
            <div 
              className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] dark:opacity-[0.03]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, currentColor, currentColor 1px, transparent 1px, transparent 3px)'
              }}
            />

            {/* Terminal Header */}
            <div className="bg-muted/50 border-b border-border/50 p-4.5 flex items-center justify-between z-10">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex items-center gap-2 text-micro font-bold text-primary/70">
                <TerminalSquare className="w-4 h-4" /> SkillSutra Core Protocol
              </div>
              <div className="w-14" />
            </div>
            
            {/* Terminal Screen area */}
            <div 
              ref={scrollRef} 
              className="flex-1 p-5.5 font-mono text-[13px] flex flex-col gap-2.5 overflow-y-auto custom-scrollbar select-none z-10"
            >
              {terminalLogs.map((log, i) => (
                <div 
                  key={i}
                  className={`
                    ${log.includes('[SUCCESS]') ? 'text-primary font-semibold' : 'text-muted-foreground dark:text-neutral-400'}
                    ${log.includes('[INTEGRITY_SUCCESS]') ? 'text-[#10b981] font-semibold' : ''}
                    ${log.includes('[SYNCED]') ? 'text-secondary font-semibold' : ''}
                  `}
                >
                  {log}
                </div>
              ))}
              
              {/* Active command typing simulation */}
              <div className="text-foreground flex items-center gap-1.5">
                <span>{currentPrompt}</span>
                {isTyping && <span className="w-2 h-4.5 bg-primary animate-pulse inline-block" />}
              </div>
            </div>

            {/* Terminal Footer Panel */}
            <div className="p-4 border-t border-border/50 bg-muted/30 backdrop-blur-md flex items-center gap-4.5 z-10">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <RefreshCw className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground flex items-center gap-2">
                  Telemetry Synced
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </p>
                <p className="text-[10px] text-muted-foreground/60 font-mono">NODE_HASH: 0x8f2d...4a10</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, ShieldAlert, Zap, ShieldCheck, Cpu } from 'lucide-react';
import { useCMS } from '@/context/cms-context';

export function VisionManifest() {
  const { getVal, getJson } = useCMS();
  const brandName = getVal("global", "site_name", "SkillProof AI");
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } },
  };

  return (
    <section className="py-24 bg-[#020202] relative overflow-hidden">
      {/* Decorative Grid Bias */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }} 
      />
      
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-24"
        >
          {/* Headline Block */}
          <motion.div variants={itemVariants} className="max-w-4xl">
            <h2 className="text-micro text-primary mb-6">{getVal('vision', 'pre_title', 'The Problem / Why This Exists')}</h2>
            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase leading-none text-white">
              {getVal('vision', 'title_part1', 'Hiring is')} <span className="text-rose-600 font-black italic">{getVal('vision', 'title_part2', 'Broken.')}</span>
            </h3>
            <p className="mt-8 text-lg md:text-xl text-white/40 font-normal leading-relaxed italic max-w-2xl">
              {getVal('vision', 'problem_text', '78% of resumes contain misleading information. ATS systems reject qualified candidates. Recruiters spend 23+ hours screening per hire. The current system rewards the loudest claims, not the deepest skills.')}
            </p>
          </motion.div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div 
              variants={itemVariants} 
              className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 space-y-6 group hover:border-rose-500/20 hover:bg-rose-500/[0.01] transition-all duration-500 shadow-premium"
            >
              <ShieldAlert className="w-10 h-10 text-rose-500 mb-2 group-hover:scale-105 transition-transform duration-300" />
              <h4 className="text-2xl font-extrabold italic uppercase tracking-tight text-white font-heading">The Legacy Path</h4>
              <ul className="space-y-4 text-white/40 font-medium italic text-sm">
                <li className="flex gap-3 items-start">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>78% of resumes contain misleading claims (HireRight Report).</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>75% of qualified candidates are rejected by keyword-based ATS filters.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Average cost of a bad hire: $17,000+ in wasted time and resources.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-6 group hover:border-primary/40 hover:bg-primary/[0.08] transition-all duration-500 relative overflow-hidden shadow-floating"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <BrainCircuit className="w-20 h-20 text-primary animate-pulse" />
              </div>
              <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <Zap className="w-10 h-10 text-primary mb-2 group-hover:scale-105 transition-transform duration-300" />
              <h4 className="text-2xl font-extrabold italic uppercase tracking-tight text-white font-heading">The {brandName} Path</h4>
              <ul className="space-y-4 text-white/80 font-bold italic text-sm">
                <li className="flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>AI-verified Proof Scores replace unverifiable resume claims.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>platform credentials make skills tamper-proof and portable.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <BrainCircuit className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Semantic AI matching connects the right talent to the right role.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Closing Statement */}
          <motion.div variants={itemVariants} className="text-right space-y-6 ml-auto max-w-3xl">
            <h2 className="text-micro text-primary mb-6">{getVal('vision', 'vision_pre_title', 'Our Vision / The Future')}</h2>
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-none text-white font-heading">
              {getVal('vision', 'vision_title_part1', 'Verified Skills are the')} <span className="text-primary font-black italic bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">{getVal('vision', 'vision_title_part2', 'New Currency.')}</span>
            </h3>
            <p className="mt-8 text-lg text-white/40 font-normal leading-relaxed italic max-w-xl ml-auto">
              {getVal('vision', 'vision_text', `${brandName} replaces subjective hiring with mathematical precision. Every skill is AI-verified. Every credential is platform. Every match is data-driven.`)}
            </p>
            
            <div className="pt-10 flex justify-end gap-4 md:gap-6 flex-wrap">
                <div className="glass border border-white/5 bg-[#0a0a0f]/40 p-6 rounded-2xl flex flex-col items-end min-w-[150px] shadow-premium hover:border-primary/20 transition-all duration-300">
                    <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter font-mono">0.4s</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold tracking-widest mt-1.5">Resume Analysis</span>
                </div>
                <div className="glass border border-white/5 bg-[#0a0a0f]/40 p-6 rounded-2xl flex flex-col items-end min-w-[150px] shadow-premium hover:border-primary/20 transition-all duration-300">
                    <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 tracking-tighter font-mono">98.4%</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold tracking-widest mt-1.5">Match Accuracy</span>
                </div>
                <div className="glass border border-white/5 bg-[#0a0a0f]/40 p-6 rounded-2xl flex flex-col items-end min-w-[150px] shadow-premium hover:border-primary/20 transition-all duration-300">
                    <span className="text-2xl md:text-3xl font-extrabold text-primary tracking-tighter font-mono">60%</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold tracking-widest mt-1.5">Faster Hiring</span>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Neural Hub decoration */}
      <div className="absolute -bottom-64 -left-64 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}

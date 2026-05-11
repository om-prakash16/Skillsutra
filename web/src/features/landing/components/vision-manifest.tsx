'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, ShieldAlert, Zap, ShieldCheck, Cpu } from 'lucide-react';

export function VisionManifest() {
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
            <h2 className="text-micro text-primary mb-6">The Problem / Why This Exists</h2>
            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase leading-none text-white">
              Hiring is <span className="text-rose-600 font-black italic">Broken.</span>
            </h3>
            <p className="mt-8 text-lg md:text-xl text-white/40 font-normal leading-relaxed italic max-w-2xl">
              78% of resumes contain misleading information. ATS systems reject qualified candidates. Recruiters spend 23+ hours screening per hire. The current system rewards the loudest claims, not the deepest skills.
            </p>
          </motion.div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 group hover:border-rose-500/30 transition-all duration-500">
              <ShieldAlert className="w-10 h-10 text-rose-500 mb-2 group-hover:scale-105 transition-transform" />
              <h4 className="text-2xl font-extrabold italic uppercase tracking-tight text-white">The Legacy Path</h4>
              <ul className="space-y-4 text-white/40 font-medium italic text-sm">
                <li className="flex gap-3">
                  <span className="text-rose-500">✕</span> 78% of resumes contain misleading claims (HireRight Report).
                </li>
                <li className="flex gap-3">
                  <span className="text-rose-500">✕</span> 75% of qualified candidates are rejected by keyword-based ATS filters.
                </li>
                <li className="flex gap-3">
                  <span className="text-rose-500">✕</span> Average cost of a bad hire: $17,000+ in wasted time and resources.
                </li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-6 group hover:border-primary/50 transition-all duration-500 relative overflow-hidden shadow-premium">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-20 h-20 text-primary" />
              </div>
              <Zap className="w-10 h-10 text-primary mb-2 group-hover:scale-105 transition-transform" />
              <h4 className="text-2xl font-extrabold italic uppercase tracking-tight text-white">The SkillSutra Path</h4>
              <ul className="space-y-4 text-white/70 font-bold italic text-sm">
                <li className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" /> AI-verified Proof Scores replace unverifiable resume claims.
                </li>
                <li className="flex gap-3">
                  <Cpu className="w-5 h-5 text-primary shrink-0" /> On-chain credentials make skills tamper-proof and portable.
                </li>
                <li className="flex gap-3">
                  <BrainCircuit className="w-5 h-5 text-primary shrink-0" /> Semantic AI matching connects the right talent to the right role.
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Closing Statement */}
          <motion.div variants={itemVariants} className="text-right space-y-6 ml-auto max-w-3xl">
            <h2 className="text-micro text-primary mb-6">Our Vision / The Future</h2>
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-none text-white">
              Verified Skills are the <span className="text-primary font-black italic">New Currency.</span>
            </h3>
            <p className="mt-8 text-lg text-white/40 font-normal leading-relaxed italic max-w-xl ml-auto">
              SkillSutra replaces subjective hiring with mathematical precision. Every skill is AI-verified. Every credential is on-chain. Every match is data-driven.
            </p>
            <div className="pt-10 flex justify-end gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-700">
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-white tracking-tighter">0.4s</span>
                    <span className="text-micro">Resume Analysis</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-white tracking-tighter">98.4%</span>
                    <span className="text-micro">Match Accuracy</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-white tracking-tighter">60%</span>
                    <span className="text-micro">Faster Hiring</span>
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

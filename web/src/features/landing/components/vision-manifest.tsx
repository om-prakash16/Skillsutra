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
            <h2 className="text-micro text-primary mb-6">Manifesto 01 / The Status Quo</h2>
            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase leading-none text-white">
              Hiring is <span className="text-rose-600 font-black italic">Broken.</span>
            </h3>
            <p className="mt-8 text-lg md:text-xl text-white/40 font-normal leading-relaxed italic max-w-2xl">
              Keyword stuffing. Resume inflation. Endless screening loops. The current system rewards the loudest claims, not the deepest skills.
            </p>
          </motion.div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 group hover:border-rose-500/30 transition-all duration-500">
              <ShieldAlert className="w-10 h-10 text-rose-500 mb-2 group-hover:scale-105 transition-transform" />
              <h4 className="text-2xl font-extrabold italic uppercase tracking-tight text-white">The Legacy Path</h4>
              <ul className="space-y-4 text-white/40 font-medium italic text-sm">
                <li className="flex gap-3">
                  <span className="text-rose-500">✕</span> Unverified claims leading to 40% mis-hire rates.
                </li>
                <li className="flex gap-3">
                  <span className="text-rose-500">✕</span> Manual screening that ignores 75% of qualified talent.
                </li>
                <li className="flex gap-3">
                  <span className="text-rose-500">✕</span> Opaque processes that drain time and capital.
                </li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-6 group hover:border-primary/50 transition-all duration-500 relative overflow-hidden shadow-premium">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-20 h-20 text-primary" />
              </div>
              <Zap className="w-10 h-10 text-primary mb-2 group-hover:scale-105 transition-transform" />
              <h4 className="text-2xl font-extrabold italic uppercase tracking-tight text-white">The Neural Path</h4>
              <ul className="space-y-4 text-white/70 font-bold italic text-sm">
                <li className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" /> AI-Verified Skill Syncing.
                </li>
                <li className="flex gap-3">
                  <Cpu className="w-5 h-5 text-primary shrink-0" /> Immutable reputation for tamper-proof trust.
                </li>
                <li className="flex gap-3">
                  <BrainCircuit className="w-5 h-5 text-primary shrink-0" /> Proactive Discovery of verified talent.
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Closing Statement */}
          <motion.div variants={itemVariants} className="text-right space-y-6 ml-auto max-w-3xl">
            <h2 className="text-micro text-primary mb-6">Manifesto 02 / The Future</h2>
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-none text-white">
              Reputation is the <span className="text-primary font-black italic">New Currency.</span>
            </h3>
            <p className="mt-8 text-lg text-white/40 font-normal leading-relaxed italic max-w-xl ml-auto">
              Welcome to Best Hiring Tool. We don't just find employees; we synchronize intelligence. Every proof is a verification. Every skill is a pulse.
            </p>
            <div className="pt-10 flex justify-end gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-700">
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-white tracking-tighter">0.4s</span>
                    <span className="text-micro">Neural Synthesis</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-white tracking-tighter">99.8%</span>
                    <span className="text-micro">Trust Integrity</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-white tracking-tighter">∞</span>
                    <span className="text-micro">Verified Future</span>
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

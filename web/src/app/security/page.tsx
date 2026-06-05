"use client"

import { motion } from "framer-motion"
import { Lock, Server, FileCheck, Shield, Key } from "lucide-react"

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden pt-20 pb-20">
            <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-slate-800/20 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 container mx-auto px-4 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 backdrop-blur-md">
                        <Lock className="w-10 h-10 text-slate-300" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-white">
                        Security & Trust
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We treat your data with the highest level of security. Our infrastructure is built to protect personal profiles, company data, and proprietary code.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {[
                        { icon: Server, title: "Infrastructure Security", desc: "Data is encrypted at rest using AES-256 and in transit via TLS 1.3. We utilize isolated VPCs for database access." },
                        { icon: Key, title: "Authentication", desc: "Strict Role-Based Access Control (RBAC) powered by short-lived JWTs and secure, HttpOnly cookies." },
                        { icon: Shield, title: "Data Privacy", desc: "We never sell your data to third parties. Users have complete control over profile visibility." },
                        { icon: FileCheck, title: "Compliance", desc: "Our platform is built in accordance with GDPR and CCPA guidelines, ensuring the right to be forgotten." }
                    ].map((feature, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-muted/10 border border-white/5 p-8 rounded-3xl"
                        >
                            <feature.icon className="w-8 h-8 text-slate-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center p-8 bg-primary/5 border border-primary/10 rounded-3xl"
                >
                    <p className="text-primary-foreground/80 font-medium">
                        Found a vulnerability? We run a private bug bounty program. <br className="hidden md:block" />
                        Please report any issues directly to <span className="text-white font-bold cursor-pointer">security@besthiringtool.com</span>.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

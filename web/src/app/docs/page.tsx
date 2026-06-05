"use client"

import { motion } from "framer-motion"
import { Book, Code2, Terminal, Shield, ArrowRight } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row pt-16">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-r border-white/10 bg-background/50 backdrop-blur-xl p-6 hidden md:block shrink-0">
                <div className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Documentation</div>
                <nav className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-white/70 mb-3">Getting Started</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="text-primary font-medium cursor-pointer">Introduction</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Authentication</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Quickstart Guide</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white/70 mb-3">API Reference</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="hover:text-white cursor-pointer transition-colors">User Profiles</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Job Postings</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Webhooks</li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
                
                <div className="max-w-4xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/5 border border-white/10 mb-6 text-sm text-white/70 font-medium">
                            <Book className="w-4 h-4" /> Getting Started
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Platform Documentation</h1>
                        <p className="text-lg text-muted-foreground mb-12">
                            Everything you need to integrate with Best Hiring Tool, automate your recruitment workflows, and access technical talent data programmatically.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-muted/20 border border-white/10 hover:border-primary/30 transition-colors cursor-pointer group">
                            <Terminal className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">REST API</h3>
                            <p className="text-sm text-muted-foreground mb-4">Access our endpoints to manage jobs, sync profiles, and retrieve analytics.</p>
                            <span className="text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">View API Docs <ArrowRight className="w-4 h-4" /></span>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-muted/20 border border-white/10 hover:border-primary/30 transition-colors cursor-pointer group">
                            <Code2 className="w-8 h-8 text-emerald-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Webhooks</h3>
                            <p className="text-sm text-muted-foreground mb-4">Listen for real-time events like new applications, profile updates, and messages.</p>
                            <span className="text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">Setup Webhooks <ArrowRight className="w-4 h-4" /></span>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-8 rounded-3xl bg-background border border-blue-500/20">
                        <div className="flex items-start gap-4">
                            <Shield className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Authentication</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    All API requests require a Bearer token. You can generate API keys from your <span className="text-white">Company Settings &gt; Developers</span> dashboard. Keep your keys secure and never expose them in client-side code.
                                </p>
                                <code className="block bg-muted/50 p-4 rounded-lg text-sm text-blue-300 font-mono border border-white/5">
                                    Authorization: Bearer sk_live_...
                                </code>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

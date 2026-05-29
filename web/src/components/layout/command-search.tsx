"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, 
    Zap, 
    Briefcase, 
    Users, 
    Building2, 
    Command, 
    ArrowRight,
    Loader2,
    Settings,
    User,
    LayoutDashboard,
    PlusCircle,
    X,
    ShieldAlert,
    History,
    BarChart3,
    Flag,
    Globe,
    Code,
    Tags,
    Brain,
    Activity,
    Fingerprint,
    CreditCard
} from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api/api-client"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export function CommandSearch() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<{ jobs: any[], talent: any[], actions: any[] }>({
        jobs: [],
        talent: [],
        actions: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const isAdmin = user?.role === "admin" || (user?.role as string) === "super_admin"
    const isCompany = user?.role === "company"

    const toggle = useCallback(() => setIsOpen(o => !o), [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                toggle()
            }
            if (e.key === "Escape") {
                setIsOpen(false)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggle])

    // Candidate/Default Actions
    const staticActions = [
        { id: '1', title: 'Mission Control', icon: <LayoutDashboard className="w-4 h-4 text-primary"/>, href: '/user/dashboard', category: 'Navigation' },
        { id: '2', title: 'Reputation Nexus Profile', icon: <User className="w-4 h-4 text-primary"/>, href: '/user/profile', category: 'Personnel' },
        { id: '3', title: 'Candidacies & Applications', icon: <Briefcase className="w-4 h-4 text-primary"/>, href: '/user/applications', category: 'Personnel' },
        { id: '4', title: 'Proof & Skill Registry', icon: <Zap className="w-4 h-4 text-primary"/>, href: '/user/skills', category: 'Registry' },
        { id: '5', title: 'Credentials & Portfolio', icon: <Fingerprint className="w-4 h-4 text-primary"/>, href: '/user/credentials', category: 'Registry' },
        { id: '6', title: 'Ecosystem Jobs Find', icon: <Building2 className="w-4 h-4 text-primary"/>, href: '/jobs', category: 'Marketplace' },
        { id: '7', title: 'AI Matching Insights', icon: <Brain className="w-4 h-4 text-primary"/>, href: '/user/insights', category: 'Intelligence' },
        { id: '8', title: 'Personal Settings', icon: <Settings className="w-4 h-4 text-primary"/>, href: '/user/settings', category: 'Administration' }
    ]

    // Admin Actions
    const adminActions = [
        { id: 'a1', title: 'Global Surveillance Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-rose-500"/>, href: '/admin', category: 'Admin Overview' },
        { id: 'a2', title: 'Audit Stream Logs', icon: <History className="w-4 h-4 text-rose-500"/>, href: '/admin/logs', category: 'Admin Auditing' },
        { id: 'a3', title: 'Deep Analytics Engine', icon: <BarChart3 className="w-4 h-4 text-rose-500"/>, href: '/admin/analytics', category: 'Admin Analytics' },
        { id: 'a4', title: 'Entity Registry (Users)', icon: <Users className="w-4 h-4 text-rose-500"/>, href: '/admin/users', category: 'Admin Governance' },
        { id: 'a5', title: 'Partner Matrix (Companies)', icon: <Building2 className="w-4 h-4 text-rose-500"/>, href: '/admin/companies', category: 'Admin Governance' },
        { id: 'a6', title: 'Moderation Queue Logs', icon: <Flag className="w-4 h-4 text-rose-500"/>, href: '/admin/reports', category: 'Admin Governance' },
        { id: 'a7', title: 'Content Orchestrator (CMS)', icon: <Globe className="w-4 h-4 text-rose-500"/>, href: '/admin/cms', category: 'Admin Schema & Content' },
        { id: 'a8', title: 'Meta-Schema Engine', icon: <Code className="w-4 h-4 text-rose-500"/>, href: '/admin/schema', category: 'Admin Schema & Content' },
        { id: 'a9', title: 'Taxonomy Manager', icon: <Tags className="w-4 h-4 text-rose-500"/>, href: '/admin/taxonomy', category: 'Admin Schema & Content' },
        { id: 'a10', title: 'Resonance Tuning (AI Config)', icon: <Brain className="w-4 h-4 text-rose-500"/>, href: '/admin/ai-config', category: 'Admin Intelligence' },
        { id: 'a11', title: 'AI Evaluation Logs', icon: <Activity className="w-4 h-4 text-rose-500"/>, href: '/admin/ai-logs', category: 'Admin Intelligence' },
        { id: 'a12', title: 'Job Oversight & Moderation', icon: <Briefcase className="w-4 h-4 text-rose-500"/>, href: '/admin/jobs', category: 'Admin Intelligence' },
        { id: 'a13', title: 'infrastructure Ledger Sync', icon: <Fingerprint className="w-4 h-4 text-rose-500"/>, href: '/admin/infrastructure', category: 'Admin Infrastructure' },
        { id: 'a14', title: 'Feature Flags Toggle', icon: <Zap className="w-4 h-4 text-rose-500"/>, href: '/admin/features', category: 'Admin Infrastructure' },
        { id: 'a15', title: 'SaaS Plan Billing Matrix', icon: <CreditCard className="w-4 h-4 text-rose-500"/>, href: '/admin/subscriptions', category: 'Admin Infrastructure' },
        { id: 'a16', title: 'System Protocols Configuration', icon: <Settings className="w-4 h-4 text-rose-500"/>, href: '/admin/settings', category: 'Admin Infrastructure' }
    ]

    // Recruiter Actions
    const recruiterActions = [
        { id: 'c1', title: 'Recruiter Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4 text-emerald-400"/>, href: '/company/dashboard', category: 'Recruiter Hub' },
        { id: 'c2', title: 'Manage Open Positions', icon: <Briefcase className="w-4 h-4 text-emerald-400"/>, href: '/company/jobs', category: 'Recruiter Hub' },
        { id: 'c3', title: 'Post a New Job Opportunity', icon: <PlusCircle className="w-4 h-4 text-emerald-400"/>, href: '/company/post-job', category: 'Recruiter Hub' },
        { id: 'c4', title: 'Review Applicants Pipeline', icon: <Users className="w-4 h-4 text-emerald-400"/>, href: '/company/applicants', category: 'Recruiter Hub' },
        { id: 'c5', title: 'Developer Key Exchange API', icon: <Code className="w-4 h-4 text-emerald-400"/>, href: '/company/api', category: 'Recruiter Hub' },
        { id: 'c6', title: 'Company Identity Profile', icon: <Building2 className="w-4 h-4 text-emerald-400"/>, href: '/company/profile', category: 'Recruiter Hub' },
    ]

    const getAvailableActions = useCallback(() => {
        if (isAdmin) return [...adminActions, ...staticActions]
        if (isCompany) return [...recruiterActions, ...staticActions]
        return staticActions
    }, [isAdmin, isCompany])

    const handleSearch = async (val: string) => {
        setQuery(val)
        const available = getAvailableActions()
        
        if (val.length < 2) {
            setResults({ jobs: [], talent: [], actions: available })
            return
        }

        setIsLoading(true)
        try {
            const [jobs] = await Promise.all([
                api.jobs.list()
            ])
            
            setResults({
                jobs: jobs.filter((j: any) => j.title.toLowerCase().includes(val.toLowerCase())).slice(0, 3) || [],
                talent: [], 
                actions: available.filter(a => a.title.toLowerCase().includes(val.toLowerCase()) || a.category.toLowerCase().includes(val.toLowerCase()))
            })
        } catch (e) {
            console.error("Search sync failed", e)
        } finally {
            setIsLoading(false)
        }
    }

    const navigate = (href: string) => {
        router.push(href)
        setIsOpen(false)
        setQuery("")
    }

    // Prepare default list on first open
    useEffect(() => {
        if (isOpen) {
            setResults({ jobs: [], talent: [], actions: getAvailableActions() })
        }
    }, [isOpen, getAvailableActions])

    return (
        <>
            {/* Search Trigger */}
            <button 
                onClick={toggle}
                className={cn(
                    "hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-black/5 dark:bg-muted/50 border border-black/10 dark:border-border hover:bg-black/10 dark:hover:bg-muted/50 transition-all text-muted-foreground group",
                    isAdmin ? "hover:border-rose-500/40" : "hover:border-primary/40"
                )}
            >
                <Search className={cn("w-4 h-4 transition-colors", isAdmin ? "group-hover:text-rose-400" : "group-hover:text-primary")} />
                <span className="text-xs font-black uppercase tracking-widest">Search Command</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-black/10 dark:border-border bg-black/5 dark:bg-muted/50 px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className={cn(
                                "relative w-full max-w-2xl bg-[#0a0a0a] border rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-300",
                                isAdmin ? "border-rose-500/20 shadow-rose-500/5" : "border-border"
                            )}
                        >
                            {/* Search Input Area */}
                            <div className="flex items-center gap-4 p-6 border-b border-border/50">
                                <Search className={cn("w-6 h-6 animate-pulse", isAdmin ? "text-rose-500" : "text-primary")} />
                                <input 
                                    autoFocus
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder={isAdmin ? "Initiate admin command overrides, registries, schemas..." : "Search mission parameters, personnel, or systems..."}
                                    className="bg-transparent border-none focus:ring-0 w-full text-xl font-black italic tracking-tight text-foreground placeholder:text-muted-foreground/50 outline-hidden"
                                />
                                {isLoading ? (
                                    <Loader2 className={cn("w-5 h-5 animate-spin", isAdmin ? "text-rose-500/40" : "text-primary/40")} />
                                ) : (
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">⌘K</div>
                                )}
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
                                {query.length === 0 && (
                                    <div className="p-2 mb-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-4 px-2">Jump To System</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {getAvailableActions().map(action => (
                                                <button
                                                    key={action.id}
                                                    onClick={() => navigate(action.href)}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 hover:bg-white/[0.08] transition-all text-left group",
                                                        isAdmin ? "hover:border-rose-500/30" : "hover:border-primary/30"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform",
                                                        isAdmin ? "text-rose-400" : "text-primary"
                                                    )}>
                                                        {action.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-wide text-foreground">{action.title}</p>
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">{action.category}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.actions.length > 0 && query.length > 0 && (
                                    <div className="space-y-2 mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-4">Detected Commands</p>
                                        {results.actions.map(action => (
                                            <button
                                                key={action.id}
                                                onClick={() => navigate(action.href)}
                                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.05] group transition-all text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="group-hover:scale-110 transition-transform">
                                                        {action.icon}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-foreground/90 group-hover:text-foreground block text-sm">{action.title}</span>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">{action.category}</span>
                                                    </div>
                                                </div>
                                                <ArrowRight className={cn("w-4 h-4 text-white/0 group-hover:translate-x-1 transition-all", isAdmin ? "group-hover:text-rose-400" : "group-hover:text-primary")} />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {results.jobs.length > 0 && query.length > 0 && (
                                    <div className="space-y-2 mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-4">Detected Jobs</p>
                                        {results.jobs.map(job => (
                                            <button
                                                key={job.id}
                                                onClick={() => navigate(`/jobs/${job.id}`)}
                                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.05] group transition-all text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Briefcase className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                                    <span className="font-bold text-foreground/90 group-hover:text-foreground text-sm">{job.title}</span>
                                                </div>
                                                <ArrowRight className={cn("w-4 h-4 text-white/0 group-hover:translate-x-1 transition-all", isAdmin ? "group-hover:text-rose-400" : "group-hover:text-primary")} />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {query.length > 0 && results.jobs.length === 0 && results.actions.length === 0 && !isLoading && (
                                    <div className="py-20 text-center">
                                        <Zap className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                        <p className="text-muted-foreground/50 font-black italic uppercase tracking-widest">No matching parameters detected in Nexus.</p>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Status Bar */}
                            <div className="bg-muted/30 border-t border-border/50 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                        <kbd className="border border-border px-1 rounded bg-muted/50">⏎</kbd> Select
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                        <kbd className="border border-border px-1 rounded bg-muted/50">ESC</kbd> Close
                                    </div>
                                </div>
                                <div className={cn("flex items-center gap-2 text-[8px] font-black uppercase tracking-widest italic", isAdmin ? "text-rose-400/60" : "text-primary/40")}>
                                    {isAdmin ? "Admin Security Subsystem Active v1.1" : "Strategic Discovery v1.1"}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

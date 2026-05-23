"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight, ShieldCheck, Cpu, Database, Landmark, ShoppingCart, Activity, Zap, Globe, ArrowUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCMS } from "@/context/cms-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export function Footer({ forceVisible }: { forceVisible?: boolean }) {
    const pathname = usePathname()
    const { getVal, getJson } = useCMS()
    const isDashboard = ["/user", "/admin", "/company"].some(prefix => pathname?.startsWith(prefix))

    const [showBackToTop, setShowBackToTop] = useState(false)
    const [blockNumber, setBlockNumber] = useState(124501)
    const [latency, setLatency] = useState(14)
    const [throughput, setThroughput] = useState(145)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (isDashboard) return
        const interval = setInterval(() => {
            setBlockNumber(prev => prev + Math.floor(Math.random() * 2))
            setLatency(prev => {
                const change = Math.floor(Math.random() * 5) - 2
                const newVal = prev + change
                return newVal > 8 && newVal < 25 ? newVal : prev
            })
            setThroughput(prev => {
                const change = Math.floor(Math.random() * 11) - 5
                const newVal = prev + change
                return newVal > 120 && newVal < 180 ? newVal : prev
            })
        }, 3000)
        return () => clearInterval(interval)
    }, [isDashboard])

    if (isDashboard && !forceVisible) return null

    const siteName = "Verified Identity"
    const copyright = getVal("global", "copyright", `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`)

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const sectors = [
        { name: "Fintech", icon: <Landmark className="w-4 h-4" /> },
        { name: "Artificial Intelligence", icon: <Cpu className="w-4 h-4" /> },
        { name: "Cybersecurity", icon: <ShieldCheck className="w-4 h-4" /> },
        { name: "E-commerce", icon: <ShoppingCart className="w-4 h-4" /> },
        { name: "Healthcare", icon: <Activity className="w-4 h-4" /> },
        { name: "Data Science", icon: <Database className="w-4 h-4" /> },
        { name: "Web3 & Blockchain", icon: <Zap className="w-4 h-4" /> }
    ]
    
    const defaultColumns = [
        {
            title: "Platform",
            links: [
                { label: "Job Board", href: "/jobs" },
                { label: "Partner Network", href: "/companies" },
                { label: "Pricing", href: "/pricing" }
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Documentation", href: "/docs" },
                { label: "Skill Assessment", href: "/assessments" },
                { label: "Career Roadmap", href: "/user/roadmap" }
            ]
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" }
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Security", href: "/security" }
            ]
        }
    ]

    const columns = getJson("footer", "columns") || defaultColumns
    const socialLinks = getJson("footer", "social_links") || [
        { platform: "twitter", url: "#" },
        { platform: "linkedin", url: "#" },
        { platform: "github", url: "#" },
        { platform: "instagram", url: "#" }
    ]

    return (
        <footer className="relative bg-background pt-8 pb-12 overflow-hidden border-t border-black/5 dark:border-white/5">
            {/* Market Sectors Marquee */}
            <div className="w-full border-b border-black/5 dark:border-white/5 pb-10 mb-16 overflow-hidden">
                <div className="container mx-auto px-4 mb-8">
                    <p className="text-micro text-muted-foreground text-center">Standardizing Talent Across Global Sectors</p>
                </div>
                <div className="flex gap-16 whitespace-nowrap animate-marquee">
                    {[...sectors, ...sectors].map((sector, i) => (
                        <div key={i} className="flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all duration-300 cursor-default group scale-95 hover:scale-100">
                            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-sm">
                                {sector.icon}
                            </div>
                            <span className="text-[11px] font-bold tracking-widest uppercase">{sector.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute top-40 right-0 -mr-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-30" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
                    <div className="space-y-8 max-w-lg">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 shadow-premium transition-transform group-hover:scale-105 backdrop-blur-md">
                                <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />
                            </div>
                            <span className="text-2xl font-bold font-heading tracking-tight text-gradient">{siteName}</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed text-lg font-normal italic opacity-80">
                            {getVal("global", "footer_tagline", "Synchronizing global intelligence through verified proof. No more resume inflation. No more keywords without skills.")}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social: any) => (
                                <motion.a
                                    key={social.platform}
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all shadow-sm backdrop-blur-sm"
                                >
                                    {social.platform === "twitter" && <Twitter className="w-5 h-5" />}
                                    {social.platform === "facebook" && <Facebook className="w-5 h-5" />}
                                    {social.platform === "instagram" && <Instagram className="w-5 h-5" />}
                                    {social.platform === "linkedin" && <Linkedin className="w-5 h-5" />}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:pl-16">
                        <div className="glass rounded-3xl p-8 relative overflow-hidden group shadow-premium">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Mail className="w-24 h-24 -mr-6 -mt-6 rotate-12 text-primary" />
                            </div>
                            <div className="flex flex-col mb-8 relative z-10">
                                <h3 className="text-2xl font-bold tracking-tight mb-2">Stay ahead of the curve</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-muted overflow-hidden shadow-lg">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" className="w-full h-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-micro text-muted-foreground font-bold">Join 10,000+ talent experts</span>
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-6 relative z-10 text-sm leading-relaxed">Get the latest platform updates, hiring trends, and career tips delivered to your inbox.</p>
                            <form className="flex flex-col sm:flex-row gap-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <Input 
                                    placeholder="Professional email" 
                                    className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 focus:border-primary/50 h-12 rounded-xl transition-all shadow-inner text-sm px-5"
                                />
                                <Button variant="premium" className="h-12 px-8 rounded-xl font-bold text-xs tracking-widest">
                                    Subscribe
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                            <p className="text-micro text-muted-foreground mt-6 text-center opacity-40">Verified high-signal insights only.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-black/5 dark:border-white/5">
                    {columns.map((col: any) => (
                        <div key={col.title} className="space-y-6">
                            <h4 className="text-micro text-foreground font-bold opacity-40">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map((link: any) => (
                                    <li key={link.href}>
                                        <Link 
                                            href={link.href} 
                                            className="text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center group/link text-sm font-normal"
                                        >
                                            <span className="bg-primary/0 group-hover/link:bg-primary/40 h-1 w-0 group-hover/link:w-3 mr-0 group-hover/link:mr-2 rounded-full transition-all duration-300" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Protocol Telemetry Dashboard Control Panel */}
                <div className="mt-8 border border-white/[0.03] dark:border-white/5 bg-black/5 dark:bg-[#07070a]/60 backdrop-blur-md p-6 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-6 items-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                    
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <motion.div 
                                className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </div>
                        <div>
                            <p className="text-[9px] text-muted-foreground uppercase font-mono font-semibold tracking-wider">NETWORK STATUS</p>
                            <p className="text-xs font-bold text-emerald-500 font-mono">NOMINAL ({latency}ms)</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Database className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[9px] text-muted-foreground uppercase font-mono font-semibold tracking-wider">LEDGER HEIGHT</p>
                            <p className="text-xs font-bold text-foreground font-mono">BLOCK #{blockNumber.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                            <Activity className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                            <p className="text-[9px] text-muted-foreground uppercase font-mono font-semibold tracking-wider">THROUGHPUT</p>
                            <p className="text-xs font-bold text-foreground font-mono">{throughput} ops/sec</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-[9px] text-muted-foreground uppercase font-mono font-semibold tracking-wider">GLOBAL GATEWAYS</p>
                            <p className="text-xs font-bold text-foreground font-mono">42 ACTIVE NODES</p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 relative">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="text-xs text-muted-foreground font-medium">
                            {copyright}
                        </p>
                        <div className="hidden md:block w-px h-4 bg-white/5" />
                        <p className="text-[11px] text-muted-foreground font-mono">
                            VERIFIED IDENTITY PROTOCOL v1.0.0
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/lang font-bold">
                                <Globe className="w-4 h-4 group-hover/lang:text-primary transition-colors" />
                                <span>English (Global)</span>
                            </div>
                            <div className="w-px h-4 bg-white/5" />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="opacity-40 uppercase tracking-widest text-[9px] font-bold">Powered by</span>
                                <span className="font-bold tracking-tight flex items-center gap-1.5 text-foreground">
                                    <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
                                    {siteName}
                                </span>
                            </div>
                        </div>
                        
                        <AnimatePresence>
                            {showBackToTop && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                    onClick={scrollToTop}
                                    className="p-3.5 rounded-xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all z-50 group hover:-translate-y-1 active-click"
                                    aria-label="Back to top"
                                >
                                    <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </footer>
    )
}

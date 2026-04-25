"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Briefcase, Mail, ArrowRight, Zap, CheckCircle2, Globe, ArrowUp, ShieldCheck, Cpu, Database, Landmark, ShoppingCart, Activity } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useCMS } from "@/context/cms-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export function Footer({ forceVisible }: { forceVisible?: boolean }) {
    const pathname = usePathname()
    const { getVal, getJson } = useCMS()
    const isDashboard = ["/user", "/admin", "/company"].some(prefix => pathname?.startsWith(prefix))

    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    if (isDashboard && !forceVisible) return null

    const siteName = "Best Hiring Tool"
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
    
    // Professional Fallback Columns if CMS is empty
    const defaultColumns = [
        {
            title: "Platform",
            links: [
                { label: "Job Board", href: "/jobs" },
                { label: "Partner Matrix", href: "/companies" },
                { label: "Features", href: "/#features" },
                { label: "Pricing", href: "/pricing" }
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Documentation", href: "/docs" },
                { label: "Skill Assessment", href: "/assessments" },
                { label: "Career Roadmap", href: "/user/roadmap" },
                { label: "Help Center", href: "/support" }
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
                { label: "Cookie Policy", href: "/cookies" },
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
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black text-center opacity-60">Standardizing Talent Across Global Sectors</p>
                </div>
                <div className="flex gap-16 whitespace-nowrap animate-marquee">
                    {[...sectors, ...sectors].map((sector, i) => (
                        <div key={i} className="flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all duration-300 cursor-default group scale-90 hover:scale-100">
                            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-sm">
                                {sector.icon}
                            </div>
                            <span className="text-xs font-black tracking-[0.1em] uppercase">{sector.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ambient background glows */}
            <div className="absolute top-40 right-0 -mr-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-30" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Tier 1: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
                    <div className="space-y-8 max-w-lg">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="bg-primary/20 p-2.5 rounded-2xl border border-primary/20 shadow-xl shadow-primary/10 transition-transform group-hover:scale-110 backdrop-blur-md">
                                <ShieldCheck className="w-8 h-8 text-primary fill-primary/10" />
                            </div>
                            <span className="text-3xl font-black font-heading tracking-tighter text-gradient">{siteName}</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed text-xl font-medium italic opacity-80">
                            {getVal("global", "footer_tagline", "Synchronizing global intelligence through verified proof. No more resume inflation. No more keywords without skills.")}
                        </p>
                        <div className="flex gap-5">
                            {socialLinks.map((social: any) => (
                                <motion.a
                                    key={social.platform}
                                    href={social.url}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all shadow-sm backdrop-blur-sm"
                                >
                                    {social.platform === "twitter" && <Twitter className="w-5 h-5" />}
                                    {social.platform === "facebook" && <Facebook className="w-5 h-5" />}
                                    {social.platform === "instagram" && <Instagram className="w-5 h-5" />}
                                    {social.platform === "linkedin" && <Linkedin className="w-5 h-5" />}
                                    {social.platform === "github" && (
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    )}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:pl-16">
                        <div className="glass rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl shadow-primary/5">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Mail className="w-32 h-32 -mr-8 -mt-8 rotate-12 text-primary" />
                            </div>
                            <div className="flex flex-col mb-8 relative z-10">
                                <h3 className="text-2xl font-black tracking-tight mb-2">Stay ahead of the curve</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-4 border-background bg-muted overflow-hidden shadow-lg">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" className="w-full h-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-black uppercase tracking-widest">Join 10,000+ talent experts</span>
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-8 relative z-10 text-base leading-relaxed">Get the latest platform updates, hiring trends, and career tips delivered to your inbox.</p>
                            <form className="flex flex-col sm:flex-row gap-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <Input 
                                    placeholder="Enter your professional email" 
                                    className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 focus:border-primary/50 h-14 rounded-2xl transition-all shadow-inner text-base px-6"
                                />
                                <Button variant="premium" className="h-14 px-10">
                                    Subscribe Now
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                            <p className="text-[10px] text-muted-foreground mt-6 uppercase tracking-[0.3em] font-black opacity-40">Verified high-signal insights only.</p>
                        </div>
                    </div>
                </div>

                {/* Tier 2: Navigation Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-20 border-y border-black/5 dark:border-white/5">
                    {columns.map((col: any) => (
                        <div key={col.title} className="space-y-8">
                            <h4 className="font-black text-foreground tracking-[0.25em] uppercase text-[10px] opacity-40">{col.title}</h4>
                            <ul className="space-y-5">
                                {col.links.map((link: any) => (
                                    <li key={link.href}>
                                        <Link 
                                            href={link.href} 
                                            className="text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center group/link text-sm font-medium"
                                        >
                                            <span className="bg-primary/0 group-hover/link:bg-primary/40 h-1 w-0 group-hover/link:w-4 mr-0 group-hover/link:mr-3 rounded-full transition-all duration-300" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Tier 3: Bottom Bar */}
                <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10 relative">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p className="text-xs text-muted-foreground font-medium">
                            {copyright}
                        </p>
                        <div className="flex items-center gap-3 px-5 py-2 glass rounded-full group cursor-help border-primary/10">
                            <motion.div 
                                className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Network Status: Nominal</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="hidden md:flex items-center gap-8">
                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/lang font-bold uppercase tracking-widest">
                                <Globe className="w-4 h-4 group-hover/lang:text-primary transition-colors" />
                                <span>English (Global)</span>
                            </div>
                            <div className="w-px h-5 bg-black/10 dark:bg-white/5" />
                            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                <span className="opacity-40 uppercase tracking-widest text-[9px] font-black">Powered by</span>
                                <span className="font-black tracking-tighter flex items-center gap-2 text-foreground">
                                    <Zap className="w-4 h-4 text-primary fill-primary" />
                                    Best Hiring Core v1.5
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
                                    className="p-4 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all z-50 group hover:-translate-y-1"
                                    aria-label="Back to top"
                                >
                                    <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </footer>
    )
}

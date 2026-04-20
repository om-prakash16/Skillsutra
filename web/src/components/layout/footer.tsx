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

    if (isDashboard && !forceVisible) return null

    const siteName = getVal("global", "site_name", "Best Hiring Tool")
    const copyright = getVal("global", "copyright", `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`)
    
    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

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
        <footer className="relative bg-background pt-8 pb-12 overflow-hidden border-t border-primary/10">
            {/* Market Sectors Marquee */}
            <div className="w-full border-b border-border/50 pb-8 mb-16 overflow-hidden">
                <div className="container mx-auto px-4 mb-6">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold text-center">Standardizing Talent Across Global Sectors</p>
                </div>
                <div className="flex gap-12 whitespace-nowrap animate-marquee">
                    {[...sectors, ...sectors].map((sector, i) => (
                        <div key={i} className="flex items-center gap-3 text-muted-foreground/60 hover:text-primary transition-colors cursor-default group">
                            <div className="p-2 rounded-lg bg-muted/30 group-hover:bg-primary/10 transition-colors">
                                {sector.icon}
                            </div>
                            <span className="text-sm font-medium tracking-tight uppercase">{sector.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ambient background glows */}
            <div className="absolute top-40 right-0 -mr-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Tier 1: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
                    <div className="space-y-6 max-w-md">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-lg shadow-primary/5 transition-transform group-hover:scale-110">
                                <Zap className="w-6 h-6 text-primary fill-primary/10" />
                            </div>
                            <span className="text-2xl font-bold font-heading tracking-tight">{siteName}</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed text-lg italic">
                            {getVal("global", "footer_tagline", "Synchronizing global intelligence through verified proof. No more resume inflation. No more keywords without skills.")}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social: any) => (
                                <motion.a
                                    key={social.platform}
                                    href={social.url}
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                                >
                                    {social.platform === "twitter" && <Twitter className="w-4 h-4" />}
                                    {social.platform === "facebook" && <Facebook className="w-4 h-4" />}
                                    {social.platform === "instagram" && <Instagram className="w-4 h-4" />}
                                    {social.platform === "linkedin" && <Linkedin className="w-4 h-4" />}
                                    {social.platform === "github" && (
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    )}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:pl-12">
                        <div className="bg-gradient-to-br from-muted/50 to-background backdrop-blur-xl border border-primary/10 rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-primary/5">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Mail className="w-24 h-24 -mr-8 -mt-8 rotate-12 text-primary" />
                            </div>
                            <div className="flex flex-col mb-6 relative z-10">
                                <h3 className="text-xl font-bold mb-1">Stay ahead of the curve</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-5 h-5 rounded-full border-2 border-background bg-muted overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" className="w-full h-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">Join 10,000+ talent experts</span>
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-6 relative z-10 text-sm">Get the latest platform updates, hiring trends, and career tips delivered to your inbox.</p>
                            <form className="flex flex-col sm:flex-row gap-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <Input 
                                    placeholder="Enter your email" 
                                    className="bg-background/80 border-border focus:ring-primary h-12 rounded-xl transition-all focus:shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                />
                                <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-semibold group whitespace-nowrap">
                                    Subscribe Now
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                            <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-[0.2em] font-bold opacity-60">Verified high-signal insights only.</p>
                        </div>
                    </div>
                </div>

                {/* Tier 2: Navigation Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-border/50">
                    {columns.map((col: any) => (
                        <div key={col.title} className="space-y-6">
                            <h4 className="font-bold text-foreground tracking-tight uppercase text-xs opacity-50">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map((link: any) => (
                                    <li key={link.href}>
                                        <Link 
                                            href={link.href} 
                                            className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center group/link text-sm"
                                        >
                                            <span className="bg-primary/0 group-hover/link:bg-primary/10 h-1 w-0 group-hover/link:w-2 mr-0 group-hover/link:mr-2 rounded-full transition-all duration-300" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Tier 3: Bottom Bar */}
                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 relative">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-sm text-muted-foreground">
                            {copyright}
                        </p>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-success/5 border border-success/20 rounded-full group cursor-help">
                            <motion.div 
                                className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Network Status: Nominal</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/lang">
                                <Globe className="w-3.5 h-3.5 group-hover/lang:text-primary transition-colors" />
                                <span>English (Global)</span>
                            </div>
                            <div className="w-px h-3 bg-border" />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="opacity-50">Powered by</span>
                                <span className="font-bold tracking-tighter flex items-center gap-1 text-foreground">
                                    <Zap className="w-3 h-3 text-primary fill-primary" />
                                    Best Hiring Tool Core
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
                                    className="p-3 rounded-xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all z-50 group"
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

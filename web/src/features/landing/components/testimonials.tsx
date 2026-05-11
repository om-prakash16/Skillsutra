"use client"

import { motion } from "framer-motion"
import { Quote, Star, BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const TESTIMONIALS = [
    {
        name: "Priya Sharma",
        role: "VP of Engineering",
        company: "TechVault India",
        content: "We cut our time-to-hire by 60% after switching to SkillSutra. The AI Proof Scores gave us confidence to skip the traditional 3-round technical screening — the verification data was that reliable.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=priya"
    },
    {
        name: "James Walker",
        role: "CTO",
        company: "Meridian Labs",
        content: "As a startup CTO, every hire is critical. SkillSutra's JD-to-candidate matching found us a senior Rust developer in 48 hours — someone traditional job boards couldn't surface in 3 months.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=james"
    },
    {
        name: "Ananya Reddy",
        role: "Senior Developer",
        company: "Freelance",
        content: "As a self-taught developer, I always struggled to prove my skills on paper. My SkillSutra Proof Score finally gives me a verified credential that companies actually trust. I got 3 interview calls in my first week.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=ananya"
    }
]

export function Testimonials() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center space-y-4 mb-16">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                        Social Proof
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Trusted by <span className="text-primary italic font-black">Industry Leaders</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base">
                        Join hundreds of forward-thinking companies already using our verified identity engine to build high-performance teams.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="glass h-full border-white/5 shadow-premium hover:border-primary/20 transition-all duration-500 rounded-3xl">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/5 -z-10" />
                                        <p className="text-muted-foreground text-sm leading-relaxed italic">
                                            "{testimonial.content}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                                <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-0.5 rounded-full border-2 border-background">
                                                <BadgeCheck className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold tracking-tight">{testimonial.name}</h4>
                                            <p className="text-micro font-bold text-muted-foreground/60">{testimonial.role} at <span className="text-primary/80">{testimonial.company}</span></p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

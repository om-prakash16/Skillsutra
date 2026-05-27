"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useCMS } from "@/context/cms-context"

const FAQS = [
    {
        question: "How does the verification engine actually work?",
        answer: "Our engine uses a multi-layered approach including AI-driven code analysis, deterministic skill assessments, and cross-reference verification against known professional repositories. This creates a high-fidelity 'Proof Score' for every skill claim."
    },
    {
        question: "Is my personal data secure?",
        answer: "Security is our top priority. We use enterprise-grade encryption for all data at rest and in transit. Your identity is verified through secure OAuth protocols, and you maintain full control over who can see your verified credentials."
    },
    {
        question: "Can I integrate this with my existing ATS?",
        answer: "Yes, our platform is designed to be ecosystem-first. We provide robust APIs and pre-built integrations for major Applicant Tracking Systems like Greenhouse, Lever, and Workable."
    },
    {
        question: "What makes Proof Scores different from traditional certifications?",
        answer: "Traditional certifications are static and often outdated. Proof Scores are dynamic, real-time measurements of actual work output and technical proficiency, updated continuously as you contribute to projects."
    }
]

export function FAQSection() {
    const { getJson } = useCMS()
    const faqsList = getJson("landing", "faqs") || FAQS;

    return (
        <section className="py-24 relative">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="text-center space-y-4 mb-16">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                        Information
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Frequently Asked <span className="text-primary italic font-black">Questions</span>
                    </h2>
                    <p className="text-muted-foreground text-base max-w-xl mx-auto">
                        Everything you need to know about our verified identity marketplace and technical verification process.
                    </p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass border-white/5 rounded-3xl p-8 md:p-12 shadow-premium"
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqsList.map((faq: any, i: number) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-white/5 last:border-0">
                                <AccordionTrigger className="text-left font-bold text-base hover:text-primary transition-colors py-6">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}

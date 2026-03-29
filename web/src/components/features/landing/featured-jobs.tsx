"use client"

import { JOBS } from "@/lib/mock-data"
import { JobCard } from "@/components/shared/job-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturedJobs() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20
            }
        }
    }

    return (
        <section className="py-24 overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-foreground">Featured Jobs</h2>
                        <p className="text-lg text-muted-foreground">Hand-picked opportunities from top companies.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/jobs">
                            <Button variant="ghost" className="gap-2 group text-primary font-bold hover:bg-primary/5">
                                View all jobs 
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {JOBS.slice(0, 4).map(job => (
                        <motion.div key={job.id} variants={itemVariants}>
                            <JobCard job={job} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

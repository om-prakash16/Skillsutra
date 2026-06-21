"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Play, Pause, RefreshCw, Clock, Cpu, CheckCircle2, AlertTriangle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MOCK_JOBS = [
    { id: "J-01", name: "Sync Platform Metrics", schedule: "0 * * * *", next_run: "in 12 mins", status: "Active", last_status: "Success" },
    { id: "J-02", name: "Process Recurring Billing", schedule: "0 0 1 * *", next_run: "in 4 days", status: "Active", last_status: "Success" },
    { id: "J-03", name: "Clean Stale Sessions", schedule: "0 2 * * *", next_run: "in 10 hours", status: "Paused", last_status: "Failed" },
    { id: "J-04", name: "Generate AI Weekly Insights", schedule: "0 8 * * 1", next_run: "in 2 days", status: "Active", last_status: "Success" },
]

export default function SchedulerPage() {
    const [search, setSearch] = useState("")

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-500 border border-orange-500/30">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Job Scheduler</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        Manage Celery cron jobs, background workers, and asynchronous tasks executing on the platform.
                    </p>
                </div>
            </div>

            <div className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-background/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search tasks..." 
                            className="pl-9 h-9 bg-background/50 border-border/50 text-xs"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button size="sm" className="h-9 text-xs font-bold gap-2">
                        <Cpu className="w-4 h-4" />
                        New Cron Job
                    </Button>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/[0.05] bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground/80">
                            <th className="px-6 py-4 font-black">Task Name</th>
                            <th className="px-6 py-4 font-black">CRON</th>
                            <th className="px-6 py-4 font-black">Next Run</th>
                            <th className="px-6 py-4 font-black">State</th>
                            <th className="px-6 py-4 font-black">Last Execution</th>
                            <th className="px-6 py-4 font-black text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {MOCK_JOBS.map((job) => (
                            <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-bold">{job.name}</td>
                                <td className="px-6 py-4 font-mono text-xs text-muted-foreground bg-muted/50 rounded inline-block mt-3 ml-6 px-2 py-0.5">{job.schedule}</td>
                                <td className="px-6 py-4 text-xs font-medium">{job.next_run}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                        job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    }`}>{job.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {job.last_status === 'Success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                            job.last_status === 'Success' ? 'text-emerald-500' : 'text-rose-500'
                                        }`}>{job.last_status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-400">
                                            <Play className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-400">
                                            <Pause className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

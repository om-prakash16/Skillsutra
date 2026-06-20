"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Search, BookmarkX, ArrowRight } from "lucide-react"
import { SavedJob, SAVED_JOBS } from '@/types'
import { SavedJobsSkeleton } from "@/features/user/saved-jobs-skeleton"
import { Pagination } from "@/components/shared/pagination"
import Link from "next/link"

import { api } from "@/lib/api/api-client"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 6

export default function SavedJobsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("recent")
    const [currentPage, setCurrentPage] = useState(1)
    const [removedIds, setRemovedIds] = useState<string[]>([])

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["savedJobs"],
        queryFn: async () => {
            const res = await api.jobs.getSaved()
            return Array.isArray(res) ? res : []
        },
    })

    const filteredJobs = data
        ?.filter(job => !removedIds.includes(job.id))
        .filter(job =>
            (job.jobs?.title || job.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.jobs?.companies?.company_name || job.company || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "recent") return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
            if (sortBy === "location") return a.location.localeCompare(b.location)
            if (sortBy === "type") return a.type.localeCompare(b.type)
            return 0
        }) || []

    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1)
    }

    return (
        <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 space-y-16 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black font-heading tracking-tighter italic uppercase leading-none text-foreground">Curated Pipeline</h1>
                    <div className="flex items-center gap-4">
                        <div className="h-px w-24 bg-primary" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Monitoring bookmarked professional opportunities</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Filter curated roles..."
                            className="pl-12 h-14 glass border-border/50 focus:border-primary/30 transition-all rounded-2xl font-bold placeholder:text-muted-foreground/30"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[200px] h-14 glass border-border rounded-2xl font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
                            <SelectValue placeholder="Protocol Sort" />
                        </SelectTrigger>
                        <SelectContent className="glass border-border text-foreground">
                            <SelectItem value="recent">Recency Bias</SelectItem>
                            <SelectItem value="location">Geo Nodes</SelectItem>
                            <SelectItem value="type">Logic Type</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => <SavedJobsSkeleton key={i} />)}
                 </div>
            ) : paginatedJobs.length > 0 ? (
                <div className="space-y-12">
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {paginatedJobs.map(job => (
                             <Card key={job.id} className="glass group hover:border-primary/40 transition-all duration-500 flex flex-col rounded-[2.5rem] overflow-hidden border-border/50 relative">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={async () => {
                                        setRemovedIds(prev => [...prev, job.id])
                                        try {
                                            await api.jobs.unsave(job.item_id || job.id)
                                            toast.success("Job removed from saved list")
                                            refetch()
                                        } catch (e) {
                                            toast.error("Failed to unsave job")
                                        }
                                    }}
                                    className="absolute top-4 right-4 z-20 h-10 w-10 rounded-xl bg-muted/50 text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <BookmarkX className="w-5 h-5" />
                                </Button>
                                
                                <CardHeader className="relative overflow-hidden pt-10 px-8">
                                    <div className="space-y-3 relative z-10">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{job.jobs?.companies?.company_name || job.company}</p>
                                        <CardTitle className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-all duration-500 uppercase italic">{job.jobs?.title || job.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-8 px-8 pb-8 relative z-10">
                                    <div className="flex flex-wrap gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span className="flex items-center gap-2">Loc: <span className="text-foreground/80">{job.jobs?.location || job.location || "Remote"}</span></span>
                                        <span className="flex items-center gap-2">Type: <span className="text-foreground/80">{job.jobs?.job_type || job.type || "Full-time"}</span></span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Saved on {new Date(job.created_at || job.savedDate).toLocaleDateString()}</p>
                                </CardContent>
                                <CardFooter className="p-8 pt-6 border-t border-border/50 mt-auto relative z-10">
                                    <Link href={`/jobs/${job.item_id || job.id}`} className="w-full">
                                        <Button variant="premium" className="w-full h-14 rounded-2xl group/btn text-[10px] font-black uppercase tracking-widest">
                                            VIEW DEPLOYMENT <ArrowRight className="w-4 h-4 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center glass border-dashed border-border rounded-[3rem]">
                    <div className="w-24 h-24 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                        <BookmarkX className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-foreground mb-2">Curated Stack Empty</h3>
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/50 max-w-sm mb-10 leading-relaxed">
                        {searchQuery
                            ? "No matching nodes found in your saved pipeline."
                            : "Your curated list is empty. Synchronize with the marketplace to find high-resonance roles."}
                    </p>
                    <Link href="/jobs">
                        <Button variant="premium" className="h-14 px-10 rounded-2xl shadow-2xl shadow-primary/20 text-[10px] font-black uppercase tracking-widest">
                            BROWSE MARKETPLACE <ArrowRight className="w-4 h-4 ml-3" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

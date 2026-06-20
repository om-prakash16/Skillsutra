import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MapPin, Clock, DollarSign, Briefcase, Bookmark } from "lucide-react"
import Link from "next/link"

interface JobCardProps {
    job: {
        id: string
        title: string
        company: string
        location: string
        type: string
        salary: string
        postedAt: string
        tags: string[]
        description?: string
        rating?: number
        reviews?: number
        experience?: string
        openings?: number
        applicants?: string
        roleCategory?: string
        education?: string
        keySkills?: string[]
    }
}

export function JobCard({ job }: JobCardProps) {
    const createSlug = (title: string, company: string, id: string) => {
        const safeTitle = title || "job";
        const safeCompany = company || "company";
        const slug = `${safeTitle}-${safeCompany}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return `/jobs/${slug}-${id}`
    }

    return (
        <Card className="group relative flex flex-col overflow-hidden glass border-black/5 dark:border-border/50 hover:border-primary/40 transition-all duration-500 rounded-3xl shadow-premium">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors" />
            
            <CardHeader className="relative overflow-hidden pt-12 px-8 pb-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-black/[0.03] dark:bg-muted/30 border border-black/5 dark:border-border flex items-center justify-center text-sm font-bold text-muted-foreground/30 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-inner uppercase tracking-wider">
                        {job.company?.substring(0, 2) || "CO"}
                    </div>
                    <Badge variant="outline" className="glass bg-muted/5 dark:bg-muted/50 text-muted-foreground/50 border-black/5 dark:border-border text-micro font-bold py-1 px-4 rounded-lg group-hover:border-primary/20 group-hover:text-primary transition-all">
                        {job.type || "Full-time"}
                    </Badge>
                </div>
                <div className="space-y-1.5">
                    <p className="text-micro font-bold text-primary/80 uppercase tracking-widest">{job.company || "Unknown Company"}</p>
                    <Link href={createSlug(job.title, job.company || "company", job.id)}>
                        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-all duration-500 leading-tight">
                            {job.title}
                        </h3>
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="pb-10 px-8 flex-1 space-y-8 relative z-10">
                <div className="flex flex-wrap gap-x-8 gap-y-4 text-micro font-bold text-muted-foreground/40">
                    {job.experience && (
                        <div className="flex items-center gap-2.5">
                            <Briefcase className="w-4 h-4 text-primary/40" />
                            <span>{job.experience}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2.5">
                        <DollarSign className="w-4 h-4 text-primary/40" />
                        <span>{job.salary || "Competitive"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-primary/40" />
                        <span>{job.location || "Remote"}</span>
                    </div>
                </div>

                <div className="flex gap-2.5 flex-wrap">
                    {(job.tags || []).slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="glass border-black/5 dark:border-border text-micro font-bold text-muted-foreground/40 py-1.5 px-4 rounded-lg group-hover:border-primary/20 group-hover:text-primary/70 transition-colors">
                            {tag}
                        </Badge>
                    ))}
                    {(job.tags || []).length > 3 && (
                        <span className="text-micro font-bold text-muted-foreground/20 py-1.5">+{(job.tags || []).length - 3}</span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="px-8 py-8 border-t border-black/5 dark:border-border/50 mt-auto relative z-10 flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
                <div className="flex items-center gap-2.5 text-micro font-bold text-muted-foreground/20">
                    <Clock className="w-4 h-4" />
                    <span>{job.postedAt || "Recently"}</span>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-muted/5 dark:bg-muted/50 text-muted-foreground/20 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/10">
                        <Bookmark className="w-5 h-5" />
                    </Button>
                    <Link href={createSlug(job.title, job.company || "company", job.id)}>
                        <Button variant="premium" size="sm" className="h-11 px-8 rounded-xl text-micro font-bold tracking-widest shadow-premium transition-transform hover:scale-[1.02]">
                            DETAILS
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { GithubPR } from '@/types'
import { GitPullRequest, GitMerge, XCircle, Clock } from "lucide-react"
import Link from "next/link"

interface PRCardProps {
    pr: GithubPR
}

export function PRCard({ pr }: PRCardProps) {
    const getStatusInfo = (state: string) => {
        switch (state) {
            case "merged":
                return {
                    icon: GitMerge,
                    color: "text-purple-500",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/20",
                    label: "Merged"
                }
            case "open":
                return {
                    icon: GitPullRequest,
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    border: "border-green-500/20",
                    label: "Open"
                }
            case "closed":
                return {
                    icon: XCircle,
                    color: "text-rose-500",
                    bg: "bg-rose-500/10",
                    border: "border-rose-500/20",
                    label: "Closed"
                }
            default:
                return {
                    icon: GitPullRequest,
                    color: "text-gray-500",
                    bg: "bg-gray-500/10",
                    border: "border-gray-500/20",
                    label: "Unknown"
                }
        }
    }

    const status = getStatusInfo(pr.state)
    const StatusIcon = status.icon

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    return (
        <Card className="flex flex-col h-full hover:border-primary/50 transition-colors bg-muted/20 border-border/50">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <Link
                            href={pr.url}
                            target="_blank"
                            className="font-semibold text-sm hover:underline decoration-primary decoration-2 underline-offset-4 line-clamp-2 min-h-[2.5rem]"
                        >
                            {pr.title}
                        </Link>
                    </div>
                    <Badge className={`${status.bg} ${status.color} ${status.border} border text-[10px] h-5 px-2 py-0 font-bold uppercase tracking-wider`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                    <span className="font-mono text-primary/80">repo:</span>
                    <span className="font-bold">{pr.repoName}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t border-border/40 bg-muted/10">
                <div className="flex items-center justify-between w-full text-[10px] text-muted-foreground mt-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            <span>Created {formatDate(pr.createdAt)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80">
                        <span>Updated {formatDate(pr.updatedAt)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

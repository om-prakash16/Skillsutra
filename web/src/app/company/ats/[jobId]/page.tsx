"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api/api-client"
import { useAuth } from "@/context/auth-context"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, ArrowLeft, MoreHorizontal, UserCircle, Brain, Activity, Clock } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AtsPipelinePage() {
    const { jobId } = useParams()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [pipeline, setPipeline] = useState<any[]>([])

    // 1. Fetch Job Details
    const { data: job, isLoading: jobLoading } = useQuery({
        queryKey: ["jobDetail", jobId],
        queryFn: () => api.jobs.details(jobId as string),
        enabled: !!jobId
    })

    // 2. Fetch ATS Pipeline
    const { data: pipelineData, isLoading: pipelineLoading } = useQuery({
        queryKey: ["atsPipeline", jobId],
        queryFn: () => api.applications.getPipeline(jobId as string),
        enabled: !!jobId
    })

    useEffect(() => {
        if (pipelineData) {
            setPipeline(pipelineData)
        }
    }, [pipelineData])

    // 3. Mutation for moving stage
    const moveStageMutation = useMutation({
        mutationFn: ({ appId, stageId }: { appId: string, stageId: string }) => 
            api.applications.updateStage(appId, stageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["atsPipeline", jobId] })
        },
        onError: (err: any) => {
            toast.error(`Failed to move candidate: ${err.message}`)
            // Revert optimistic update
            queryClient.invalidateQueries({ queryKey: ["atsPipeline", jobId] })
        }
    })

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result

        // Dropped outside a valid droppable
        if (!destination) return

        // Dropped in the same place
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        // Optimistic UI Update
        const sourceStageId = source.droppableId
        const destStageId = destination.droppableId
        
        const newPipeline = [...pipeline]
        
        const sourceStageIndex = newPipeline.findIndex(s => s.id === sourceStageId)
        const destStageIndex = newPipeline.findIndex(s => s.id === destStageId)
        
        const sourceStage = newPipeline[sourceStageIndex]
        const destStage = newPipeline[destStageIndex]
        
        const [movedApp] = sourceStage.applications.splice(source.index, 1)
        
        // Update the application's stage
        movedApp.current_stage_id = destStageId
        destStage.applications.splice(destination.index, 0, movedApp)
        
        setPipeline(newPipeline)

        // Fire API request
        if (sourceStageId !== destStageId) {
            moveStageMutation.mutate({ appId: draggableId, stageId: destStageId })
        }
    }

    if (jobLoading || pipelineLoading) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
                <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground">Initializing ATS Pipeline...</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col space-y-6 pb-6 overflow-hidden animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border/50 shrink-0">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/company/jobs">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 font-black tracking-widest text-[9px] uppercase">
                            Enterprise ATS
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-black font-heading tracking-tighter uppercase italic">{job?.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link href={`/company/jobs/${jobId}/applicants`}>
                        <Button variant="outline" className="h-10 px-6 font-black tracking-widest uppercase text-[10px] rounded-xl">
                            List View
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full min-w-max px-2">
                        {pipeline.map((stage) => (
                            <div key={stage.id} className="w-[350px] flex flex-col h-full bg-muted/20 border border-border/50 rounded-2xl overflow-hidden shrink-0">
                                {/* Stage Header */}
                                <div className="p-4 border-b border-border/50 bg-black/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-black uppercase tracking-widest text-sm">{stage.name}</h3>
                                        <Badge variant="secondary" className="font-bold">{stage.applications?.length || 0}</Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={stage.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn(
                                                "flex-1 overflow-y-auto p-4 space-y-4 transition-colors min-h-[150px]",
                                                snapshot.isDraggingOver ? "bg-primary/5" : ""
                                            )}
                                        >
                                            {stage.applications?.map((app: any, index: number) => (
                                                <Draggable key={app.id} draggableId={app.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(
                                                                "cursor-grab active:cursor-grabbing transition-all",
                                                                snapshot.isDragging ? "rotate-2 scale-105" : ""
                                                            )}
                                                        >
                                                            <Card
                                                                className={cn(
                                                                    "bg-background border-border/50 shadow-sm hover:border-primary/30",
                                                                    snapshot.isDragging ? "shadow-xl border-primary/50" : ""
                                                                )}
                                                            >
                                                            <CardContent className="p-4 space-y-4">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar className="h-10 w-10 border border-border">
                                                                            <AvatarImage src={app.users?.profile_data?.avatar_url} />
                                                                            <AvatarFallback className="bg-muted font-black text-xs">
                                                                                {app.users?.full_name?.substring(0,2).toUpperCase()}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <p className="font-bold text-sm leading-none">{app.users?.full_name}</p>
                                                                            <p className="text-[10px] text-muted-foreground font-mono mt-1">
                                                                                {app.users?.wallet_address?.substring(0,6)}...
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Metrics */}
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="bg-muted/50 rounded-lg p-2 border border-border/50">
                                                                        <div className="flex items-center gap-1.5 mb-1">
                                                                            <Brain className="w-3 h-3 text-blue-500" />
                                                                            <span className="text-[8px] uppercase tracking-widest font-black text-muted-foreground">AI Match</span>
                                                                        </div>
                                                                        <span className="text-sm font-black">{app.ai_match_score || 0}%</span>
                                                                    </div>
                                                                    <div className="bg-muted/50 rounded-lg p-2 border border-border/50">
                                                                        <div className="flex items-center gap-1.5 mb-1">
                                                                            <Activity className="w-3 h-3 text-emerald-500" />
                                                                            <span className="text-[8px] uppercase tracking-widest font-black text-muted-foreground">Live Score</span>
                                                                        </div>
                                                                        <span className="text-sm font-black">{app.assessment_score !== null ? `${app.assessment_score}%` : 'N/A'}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Footer */}
                                                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                                        <Clock className="w-3 h-3" />
                                                                        <span className="text-[9px] uppercase tracking-wider font-bold">
                                                                            {new Date(app.created_at).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <Badge variant="outline" className={cn(
                                                                        "text-[9px] px-2 py-0 uppercase tracking-widest border-border/50",
                                                                        app.status === 'shortlisted' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' : ''
                                                                    )}>
                                                                        {app.status}
                                                                    </Badge>
                                                                </div>
                                                            </CardContent>
                                                            </Card>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    )
}

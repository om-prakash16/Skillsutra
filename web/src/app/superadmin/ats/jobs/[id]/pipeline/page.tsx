"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchWrapper } from "@/lib/fetch";
import { ArrowLeft, Users, Calendar, Bot, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

export default function PipelineBoard() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoard();
  }, [jobId]);

  const loadBoard = async () => {
    setLoading(true);
    try {
      const res = await fetchWrapper(`/ats/applications/board/${jobId}`);
      if (res.success) {
        setStages(res.data);
      }
    } catch (e) {
      toast.error("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI update
    const sourceStage = stages.find(s => s.stage_id === source.droppableId);
    const destStage = stages.find(s => s.stage_id === destination.droppableId);
    const draggedApp = sourceStage.applications.find((a: any) => a.id === draggableId);

    const newStages = stages.map(stage => {
      if (stage.stage_id === source.droppableId) {
        return { ...stage, applications: stage.applications.filter((a: any) => a.id !== draggableId) };
      }
      if (stage.stage_id === destination.droppableId) {
        const newApps = Array.from(stage.applications);
        newApps.splice(destination.index, 0, draggedApp);
        return { ...stage, applications: newApps };
      }
      return stage;
    });

    setStages(newStages);

    // Persist to backend
    if (source.droppableId !== destination.droppableId) {
      try {
        await fetchWrapper(`/ats/applications/${draggableId}/move`, {
          method: 'POST',
          body: JSON.stringify({ stage_id: destination.droppableId })
        });
        toast.success("Candidate moved");
      } catch (e) {
        toast.error("Failed to move candidate");
        loadBoard(); // Revert on failure
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="p-6 border-b bg-background flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/ats/jobs")}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hiring Pipeline</h1>
            <p className="text-muted-foreground text-sm">Frontend Engineer (San Francisco)</p>
          </div>
          <div className="ml-auto flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input placeholder="Search candidates..." className="pl-9 w-[250px]" />
            </div>
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">Loading pipeline...</div>
        ) : stages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">No stages configured for this job.</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6">
              {stages.map((stage) => (
                <div key={stage.stage_id} className="w-[320px] shrink-0 flex flex-col max-h-full">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-semibold">{stage.stage_name}</h3>
                    <Badge variant="secondary" className="rounded-full">{stage.applications.length}</Badge>
                  </div>
                  
                  <Droppable droppableId={stage.stage_id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto custom-scrollbar p-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-muted/50'}`}
                      >
                        {stage.applications.map((app: any, index: number) => (
                          <Draggable key={app.id} draggableId={app.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-4 bg-background rounded-lg border shadow-sm flex flex-col gap-3 hover:border-primary/50 transition-colors ${snapshot.isDragging ? 'shadow-md ring-2 ring-primary/20' : ''}`}
                                onClick={() => router.push(`/admin/ats/candidates/${app.candidate_id}`)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="font-semibold text-sm">John Doe {app.id.substring(0,4)}</div>
                                  <Badge variant={app.score > 0.8 ? "default" : "secondary"} className="text-[10px]">
                                    <Bot className="w-3 h-3 mr-1" /> {(app.score * 100).toFixed(0)}%
                                  </Badge>
                                </div>
                                
                                <div className="text-xs text-muted-foreground line-clamp-1">React, Next.js, TypeScript</div>
                                
                                <div className="flex items-center gap-3 pt-2 border-t mt-1">
                                  <div className="flex items-center text-xs text-muted-foreground"><Calendar className="w-3 h-3 mr-1" /> 2d ago</div>
                                  <div className="flex items-center text-xs text-yellow-500 font-medium ml-auto"><Star className="w-3 h-3 mr-1" /> 4.5</div>
                                </div>
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
        )}
      </div>
    </div>
  );
}

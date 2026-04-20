import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Github, ExternalLink, Folder, Trash2, ShieldCheck, Search, Loader2 } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProjectsTabProps {
    data: UserProfile
    isEditing?: boolean
    onAdd?: () => void
    onDelete?: (id: string) => void
    onUpdate?: (id: string, field: string, value: string) => void
}

export function ProjectsTab({ data, isEditing, onAdd, onDelete, onUpdate }: ProjectsTabProps) {
    const [auditingId, setAuditingId] = useState<string | null>(null);
    const [auditedIds, setAuditedIds] = useState<Set<string>>(new Set());

    const handleTriggerAudit = (id: string, title: string) => {
        setAuditingId(id);
        toast.info(`AI Foreman initiating AST analysis on ${title}...`);
        
        // Simulating the backend call to GitHubEvaluator
        setTimeout(() => {
            setAuditingId(null);
            setAuditedIds(prev => new Set(prev).add(id));
            toast.success(`${title} verified. Forensic Integrity Score: 94%`);
        }, 3000);
    };

    return (
        <Card className="border-none shadow-none bg-transparent pt-4">
            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                        Project Nexus <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </h2>
                    <p className="text-sm text-muted-foreground">Verified proof-of-work repositories.</p>
                </div>
                {isEditing && (
                    <Button size="sm" onClick={onAdd} className="rounded-xl font-bold">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {data.projects.map((project: any) => {
                    const isAudited = auditedIds.has(project.id);
                    const isCurrentlyAuditing = auditingId === project.id;

                    return (
                        <Card key={project.id} className="flex flex-col h-full bg-black/40 border-white/5 hover:border-primary/50 transition-all group overflow-hidden relative">
                            <AnimatePresence>
                                {isAudited && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute top-2 right-2 z-20"
                                    >
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 rounded-full px-3 py-1 scale-90 backdrop-blur-md">
                                            <ShieldCheck className="w-3 h-3" /> AI Verified
                                        </Badge>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex gap-3 flex-1">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                                            isAudited ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"
                                        )}>
                                            <Folder className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            {isEditing ? (
                                                <>
                                                    <Input
                                                        defaultValue={project.title}
                                                        onChange={(e) => onUpdate?.(project.id, 'title', e.target.value)}
                                                        className="font-bold border-white/10 bg-white/5"
                                                        placeholder="Project Title"
                                                    />
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <Input
                                                            defaultValue={project.github}
                                                            onChange={(e) => onUpdate?.(project.id, 'github', e.target.value)}
                                                            className="text-xs h-8 border-white/10 bg-white/5"
                                                            placeholder="GitHub URL"
                                                        />
                                                        <Input
                                                            defaultValue={project.link}
                                                            onChange={(e) => onUpdate?.(project.id, 'link', e.target.value)}
                                                            className="text-xs h-8 border-white/10 bg-white/5"
                                                            placeholder="Live URL"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <CardTitle className="text-lg font-black text-white">{project.title}</CardTitle>
                                                </>
                                            )}

                                            {!isEditing && (
                                                <div className="flex items-center gap-4 mt-1.5 grayscale group-hover:grayscale-0 transition-all">
                                                    {project.github && (
                                                        <Link href={project.github} className="text-muted-foreground hover:text-white transition-colors">
                                                            <Github className="w-5 h-5" />
                                                        </Link>
                                                    )}
                                                    {project.link && (
                                                        <Link href={project.link} className="text-muted-foreground hover:text-white transition-colors">
                                                            <ExternalLink className="w-5 h-5" />
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete?.(project.id)}
                                            className="h-8 w-8 text-white/40 hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 pb-4">
                                {isEditing ? (
                                    <Textarea
                                        defaultValue={project.description}
                                        onChange={(e) => onUpdate?.(project.id, 'description', e.target.value)}
                                        className="text-sm min-h-[100px] border-white/10 bg-white/5"
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-white/80 transition-colors">
                                        {project.description}
                                    </p>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <div className="flex flex-wrap gap-2 w-full">
                                    {project.stack.map((tech: any) => (
                                        <Badge key={tech} variant="secondary" className="text-[10px] uppercase font-black tracking-widest bg-white/5 text-white/60 border-white/10 rounded-md">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                                
                                {!isEditing && !isAudited && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full h-10 border-primary/20 bg-primary/5 hover:bg-primary transition-all rounded-xl font-bold text-xs uppercase tracking-widest"
                                        disabled={isCurrentlyAuditing}
                                        onClick={() => handleTriggerAudit(project.id, project.title)}
                                    >
                                        {isCurrentlyAuditing ? (
                                            <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Deep Scanning...</>
                                        ) : (
                                            <><Search className="w-3 h-3 mr-2" /> Trigger AI Audit</>
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </Card>
    )
}

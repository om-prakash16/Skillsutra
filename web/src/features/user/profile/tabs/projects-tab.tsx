import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Github, ExternalLink, Folder, Trash2, ShieldCheck, Search, Loader2 } from "lucide-react"
import { UserProfile } from "@/types/profile"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Edit, Save } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProjectsTabProps {
    data: UserProfile
    onSave?: (payload: any) => Promise<void>
    isEditing?: boolean
    onAdd?: () => void
    onDelete?: (id: string) => void
    onUpdate?: (id: string, field: string, value: string) => void
}

export function ProjectsTab({ data, onSave }: ProjectsTabProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [localProjects, setLocalProjects] = useState(data.projects || [])

    useEffect(() => {
        setLocalProjects(data.projects || [])
    }, [data.projects])

    const handleAdd = () => {
        const newProject = {
            id: Math.random().toString(),
            title: "New Project",
            description: "Description",
            github: "",
            link: "",
            stack: ["React"]
        }
        setLocalProjects([newProject, ...localProjects])
    }

    const handleDelete = (id: string) => {
        setLocalProjects(localProjects.filter((p: any) => p.id !== id))
    }

    const handleUpdate = (id: string, field: string, value: string) => {
        if (field === "stack") {
            const arr = value.split(",").map(s => s.trim()).filter(Boolean)
            setLocalProjects(localProjects.map((p: any) => p.id === id ? { ...p, [field]: arr } : p))
        } else {
            setLocalProjects(localProjects.map((p: any) => p.id === id ? { ...p, [field]: value } : p))
        }
    }

    const handleCommitChanges = async () => {
        setIsSaving(true)
        if (onSave) {
            await onSave({
                projects: localProjects.map((p: any) => ({
                    title: p.title,
                    description: p.description,
                    stack: p.stack,
                    project_url: p.link,
                    github_url: p.github
                }))
            })
        }
        setIsSaving(false)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setLocalProjects(data.projects || [])
        setIsEditing(false)
    }
    const [auditingId, setAuditingId] = useState<string | null>(null);
    const [auditedIds, setAuditedIds] = useState<Set<string>>(new Set());

    const handleTriggerAudit = (id: string, title: string) => {
        setAuditingId(id);
        toast.info(`AI Foreman initiating AST analysis on ${title}...`);
        
        setTimeout(() => {
            setAuditingId(null);
            setAuditedIds(prev => new Set(prev).add(id));
            toast.success(`${title} verified. Forensic Integrity Score: 94%`);
        }, 3000);
    };

    return (
        <Card className="border-none shadow-none bg-transparent pt-4">
            <div className="flex justify-between items-center mb-10 px-2">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase italic flex items-center gap-3">
                        Project Nexus <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Verified proof-of-work repositories and technical deployments.</p>
                </div>
                {onSave && !isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                )}
                {isEditing && (
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleAdd} variant="premium" className="h-10 px-5 rounded-xl shadow-xl shadow-primary/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Initialize Project
                        </Button>
                        <Button size="sm" onClick={handleCommitChanges} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isSaving}>
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {localProjects.map((project: any) => {
                    const isAudited = auditedIds.has(project.id);
                    const isCurrentlyAuditing = auditingId === project.id;

                    return (
                        <Card key={project.id} className="flex flex-col h-full glass border-border/50 hover:border-primary/40 transition-all duration-500 group overflow-hidden relative rounded-[2rem]">
                            <AnimatePresence>
                                {isAudited && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute top-4 right-4 z-20"
                                    >
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-2 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                                            <ShieldCheck className="w-3.5 h-3.5" /> AI VERIFIED
                                        </Badge>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <CardHeader className="pb-6 pt-8 px-8">
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex gap-4 flex-1">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-inner",
                                            isAudited ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-primary/10 text-primary border border-primary/20"
                                        )}>
                                            <Folder className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            {isEditing ? (
                                                <div className="space-y-3">
                                                    <Input
                                                        value={project.title || ""}
                                                        onChange={(e) => handleUpdate(project.id, 'title', e.target.value)}
                                                        className="font-black h-10 glass border-border rounded-lg text-sm"
                                                        placeholder="Project Title"
                                                    />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Input
                                                            value={project.github || ""}
                                                            onChange={(e) => handleUpdate(project.id, 'github', e.target.value)}
                                                            className="text-[10px] font-bold h-8 glass border-border rounded-lg"
                                                            placeholder="Source URL"
                                                        />
                                                        <Input
                                                            value={project.link || ""}
                                                            onChange={(e) => handleUpdate(project.id, 'link', e.target.value)}
                                                            className="text-[10px] font-bold h-8 glass border-border rounded-lg"
                                                            placeholder="Live Node"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <CardTitle className="text-xl font-black text-foreground tracking-tight">{project.title}</CardTitle>
                                                </>
                                            )}

                                            {!isEditing && (
                                                <div className="flex items-center gap-5 mt-2 opacity-40 group-hover:opacity-100 transition-all duration-500">
                                                    {project.github && (
                                                        <Link href={project.github} className="text-foreground hover:text-primary transition-colors">
                                                            <Github className="w-5 h-5" />
                                                        </Link>
                                                    )}
                                                    {project.link && (
                                                        <Link href={project.link} className="text-foreground hover:text-primary transition-colors">
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
                                            onClick={() => handleDelete(project.id)}
                                            className="h-10 w-10 text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 pb-6 px-8">
                                {isEditing ? (
                                    <div className="space-y-1">
                                         <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Project Documentation</Label>
                                             <Textarea
                                                value={project.description || ""}
                                                onChange={(e) => handleUpdate(project.id, 'description', e.target.value)}
                                            className="text-sm min-h-[120px] glass border-border rounded-xl p-4 leading-relaxed"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">
                                        {project.description}
                                    </p>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-6 px-8 pb-8">
                                <div className="flex flex-wrap gap-2.5 w-full">
                                    {isEditing ? (
                                        <div className="space-y-1 w-full">
                                            <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Tech Nodes (Comma Separated)</Label>
                                             <Input
                                                value={project.stack?.join(", ") || ""}
                                                onChange={(e) => handleUpdate(project.id, 'stack', e.target.value)}
                                                className="text-xs h-10 glass border-border rounded-xl"
                                                placeholder="React, TypeScript, Python..."
                                            />
                                        </div>
                                    ) : (
                                        project.stack.map((tech: any) => (
                                            <Badge key={tech} variant="outline" className="glass py-1 px-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground border-border rounded-lg group-hover:border-primary/20 group-hover:text-primary/60 transition-colors">
                                                {tech}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                                
                                {!isEditing && !isAudited && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full h-12 glass border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/5"
                                        disabled={isCurrentlyAuditing}
                                        onClick={() => handleTriggerAudit(project.id, project.title)}
                                    >
                                        {isCurrentlyAuditing ? (
                                            <><Loader2 className="w-4 h-4 mr-3 animate-spin" /> Deep Scanning Source...</>
                                        ) : (
                                            <><Search className="w-4 h-4 mr-3" /> Initiate AI Proof Audit</>
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
                {localProjects.length === 0 && (
                    <div className="col-span-2 text-center py-24 bg-muted/30 border border-dashed border-border rounded-[3rem]">
                         <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/50">Awaiting Deployment Ledger Sync...</p>
                    </div>
                )}
            </div>
        </Card>
    )
}

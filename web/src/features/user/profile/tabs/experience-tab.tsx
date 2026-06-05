import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Building2, ArrowRight } from "lucide-react"
import { UserProfile } from "@/types/profile"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, Loader2 } from "lucide-react"

interface ExperienceTabProps {
    data: UserProfile
    onSave?: (payload: any) => Promise<void>
    isEditing?: boolean
    onAdd?: () => void
    onDelete?: (id: string) => void
    onUpdate?: (id: string, field: string, value: string) => void
}

export function ExperienceTab({ data, onSave }: ExperienceTabProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [localExperiences, setLocalExperiences] = useState(data.experience || [])

    useEffect(() => {
        setLocalExperiences(data.experience || [])
    }, [data.experience])

    const handleAdd = () => {
        const newExp = {
            id: Math.random().toString(),
            role: "New Role",
            company: "New Company",
            logo: "",
            type: "Full-time" as "Full-time" | "Part-time" | "Contract" | "Freelance",
            startDate: "2024-01",
            endDate: "Present",
            description: ""
        }
        setLocalExperiences([newExp, ...localExperiences])
    }

    const handleDelete = (id: string) => {
        setLocalExperiences(localExperiences.filter((e: any) => e.id !== id))
    }

    const handleUpdate = (id: string, field: string, value: string) => {
        setLocalExperiences(localExperiences.map((e: any) => e.id === id ? { ...e, [field]: value } : e))
    }

    const handleCommitChanges = async () => {
        setIsSaving(true)
        if (onSave) {
            await onSave({
                experiences: localExperiences.map((e: any) => ({
                    company_name: e.company,
                    role: e.role,
                    employment_type: e.type,
                    description: e.description,
                    start_date: e.startDate,
                    end_date: e.endDate === "Present" ? null : e.endDate
                }))
            })
        }
        setIsSaving(false)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setLocalExperiences(data.experience || [])
        setIsEditing(false)
    }
    return (
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pt-10 px-10">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Proof of Work</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Immutable chronological ledger of professional deployments.
                    </CardDescription>
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
                            Log New Role
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
            </CardHeader>
            <CardContent className="space-y-10 px-10 pb-12 pt-6">
                {localExperiences.map((exp: any, index: any) => (
                    <div key={exp.id} className={cn(
                        "relative flex gap-6 group",
                        index !== localExperiences.length - 1 ? "pb-10 border-b border-border/50" : ""
                    )}>
                        <div className="w-16 h-16 bg-muted/30 border border-border rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                            {exp.logo ? (
                                <span className="font-black text-xl text-primary/40">{exp.company[0]}</span>
                            ) : (
                                <Building2 className="w-7 h-7 text-primary/30" />
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1 flex-1 mr-4">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <Input
                                                value={exp.role || ''}
                                                onChange={(e) => handleUpdate(exp.id, 'role', e.target.value)}
                                                className="font-bold h-10 glass border-border rounded-lg text-sm"
                                                placeholder="Role Title"
                                            />
                                            <div className="flex gap-3">
                                                <Input
                                                    value={exp.company || ''}
                                                    onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                                                    className="h-9 glass border-border rounded-lg text-xs"
                                                    placeholder="Company"
                                                />
                                                <Input
                                                    value={exp.type || ''}
                                                    onChange={(e) => handleUpdate(exp.id, 'type', e.target.value)}
                                                    className="h-9 glass border-border rounded-lg text-xs w-32"
                                                    placeholder="Contract Type"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="font-black text-lg text-foreground tracking-tight leading-none">{exp.role}</h3>
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest pt-1">
                                                <span className="text-primary">{exp.company}</span>
                                                <span className="text-muted-foreground/30">•</span>
                                                <span className="text-muted-foreground">{exp.type}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(exp.id)}
                                            className="h-10 w-10 text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="flex gap-4">
                                     <div className="space-y-1 flex-1">
                                          <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Genesis</Label>
                                          <Input 
                                              value={exp.startDate || ''} 
                                              onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                                              type="month"
                                              className="h-9 glass border-border rounded-lg text-xs" 
                                          />
                                     </div>
                                     <div className="space-y-1 flex-1">
                                          <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Termination</Label>
                                          <Input 
                                              value={exp.endDate || ''} 
                                              onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                                              className="h-9 glass border-border rounded-lg text-xs" 
                                              placeholder="YYYY-MM or 'Present'" 
                                          />
                                     </div>
                                </div>
                            ) : (
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2">
                                    {exp.startDate} <ArrowRight className="w-2 h-2" /> {exp.endDate}
                                </p>
                            )}

                            {isEditing ? (
                                <div className="space-y-1">
                                     <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Deployment Specs</Label>
                                     <Textarea 
                                        value={exp.description || ''} 
                                        className="min-h-[100px] glass border-border rounded-xl text-sm p-4" 
                                        onChange={(e) => handleUpdate(exp.id, 'description', e.target.value)}
                                        placeholder="Describe your achievements..."
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground leading-relaxed italic font-medium">
                                    {exp.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

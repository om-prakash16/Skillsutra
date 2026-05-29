import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GraduationCap, Pencil, Trash2 } from "lucide-react"
import { UserProfile } from "@/types/profile"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"

interface EducationTabProps {
    data: UserProfile
    isEditing?: boolean
    onAdd?: () => void
    onDelete?: (id: string) => void
    onUpdate?: (id: string, field: string, value: any) => void
}

export function EducationTab({ data, isEditing, onAdd, onDelete, onUpdate }: EducationTabProps) {
    return (
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pt-10 px-10">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Credentials Ledger</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Verified academic history and formal certification nodes.
                    </CardDescription>
                </div>
                {isEditing && (
                    <Button size="sm" onClick={onAdd} variant="premium" className="h-10 px-5 rounded-xl shadow-xl shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Log Credential
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-10 px-10 pb-12 pt-6">
                {data.education.map((edu: any, index: any) => (
                    <div key={edu.id} className={cn(
                        "relative flex gap-6 group",
                        index !== data.education.length - 1 ? "pb-10 border-b border-border/50" : ""
                    )}>
                        <div className="w-16 h-16 bg-muted/30 border border-border rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                            <GraduationCap className="w-7 h-7 text-primary/30" />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1 flex-1 mr-4">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <Input
                                                defaultValue={edu.institution}
                                                onChange={(e) => onUpdate?.(edu.id, 'institution', e.target.value)}
                                                className="font-bold h-10 glass border-border rounded-lg text-sm"
                                                placeholder="Institution Name"
                                            />
                                            <Input
                                                defaultValue={edu.degree}
                                                onChange={(e) => onUpdate?.(edu.id, 'degree', e.target.value)}
                                                className="h-9 glass border-border rounded-lg text-xs"
                                                placeholder="Degree / Specification"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="font-black text-lg text-foreground tracking-tight leading-none">{edu.institution}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest pt-1 text-primary">{edu.degree}</p>
                                        </>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete?.(edu.id)}
                                            className="h-10 w-10 text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {isEditing ? (
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="space-y-1 w-24">
                                         <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Start Year</Label>
                                         <Input
                                            value={edu.startYear || ""}
                                            onChange={(e) => onUpdate?.(edu.id, 'startYear', e.target.value)}
                                            className="h-9 glass border-border rounded-lg text-xs text-foreground"
                                            placeholder="YYYY"
                                        />
                                    </div>
                                    <div className="space-y-1 w-24">
                                         <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">End Year</Label>
                                         <Input
                                            value={edu.endYear || ""}
                                            onChange={(e) => onUpdate?.(edu.id, 'endYear', e.target.value)}
                                            className="h-9 glass border-border rounded-lg text-xs text-foreground disabled:opacity-30"
                                            placeholder="YYYY"
                                            disabled={edu.current}
                                        />
                                    </div>
                                    <div className="space-y-1 flex items-center pt-5 gap-2 px-2">
                                         <input 
                                             type="checkbox" 
                                             checked={edu.current || false} 
                                             onChange={(e) => onUpdate?.(edu.id, 'current', e.target.checked)}
                                             className="rounded border-border bg-muted/50 w-4 h-4 accent-primary cursor-pointer"
                                         />
                                         <Label className="text-[10px] font-bold uppercase text-muted-foreground cursor-pointer pt-0.5" onClick={() => onUpdate?.(edu.id, 'current', !edu.current)}>Pursuing / Present</Label>
                                    </div>
                                    <div className="space-y-1 w-24 ml-auto">
                                         <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Grade</Label>
                                         <Input
                                            value={edu.grade || ""}
                                            onChange={(e) => onUpdate?.(edu.id, 'grade', e.target.value)}
                                            className="h-9 glass border-border rounded-lg text-xs text-foreground"
                                            placeholder="G.P.A / %"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="px-3 py-1 glass border-border/50 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        Term: {edu.startYear || "N/A"} - {edu.current ? "Present" : (edu.endYear || "N/A")}
                                    </div>
                                    {edu.grade && (
                                        <div className="px-3 py-1 glass border-border/50 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400/70">
                                            Score: {edu.grade}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {data.education.length === 0 && (
                    <div className="text-center py-20 bg-muted/30 border border-dashed border-border rounded-[2rem]">
                         <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/50">Awaiting Academic Node Initialization...</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

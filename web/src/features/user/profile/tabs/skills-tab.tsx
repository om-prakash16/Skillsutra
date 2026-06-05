import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, X, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { UserProfile, Skill, ProficiencyLevel } from "@/types/profile"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Edit, Save, Loader2 } from "lucide-react"

interface SkillsTabProps {
    data: UserProfile
    onSave?: (payload: any) => Promise<void>
    isEditing?: boolean
    onAddSkill?: (newSkill: Skill) => void
    onDeleteSkill?: (skillName: string) => void
}

export function SkillsTab({ data, onSave }: SkillsTabProps) {
    const levels: ProficiencyLevel[] = ["Expert", "Advanced", "Intermediate", "Beginner"]
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    
    const [localSkills, setLocalSkills] = useState<Skill[]>(data.skills || [])
    useEffect(() => {
        setLocalSkills(data.skills || [])
    }, [data.skills])

    const [newSkillName, setNewSkillName] = useState("")
    const [newSkillLevel, setNewSkillLevel] = useState<ProficiencyLevel>("Advanced")

    const handleSaveSkill = () => {
        if (newSkillName.trim()) {
            setLocalSkills([...localSkills, { name: newSkillName, level: newSkillLevel }])
            setNewSkillName("")
            setIsAdding(false)
        }
    }

    const handleDeleteSkill = (name: string) => {
        setLocalSkills(localSkills.filter(s => s.name !== name))
    }

    const handleCommitChanges = async () => {
        setIsSaving(true)
        if (onSave) {
            await onSave({
                skills: localSkills.map(s => ({
                    name: s.name,
                    proficiency: s.level,
                    category: s.category
                }))
            })
        }
        setIsSaving(false)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setLocalSkills(data.skills || [])
        setIsAdding(false)
        setIsEditing(false)
    }

    return (
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pt-10 px-10">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Architecture Matrix</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Manage your technical nodes and proficiency synthesis.
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
                        {!isAdding && (
                            <Button size="sm" onClick={() => setIsAdding(true)} variant="premium" className="h-10 px-5 rounded-xl shadow-xl shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Node
                            </Button>
                        )}
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
            <CardContent className="space-y-12 px-10 pb-12 pt-6">
                {isAdding && (
                    <div className="p-6 md:p-8 rounded-[2rem] bg-background/80 border border-border backdrop-blur-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        {/* Decorative background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                        
                        <div className="relative flex flex-col md:flex-row items-end gap-4">
                            <div className="flex-1 w-full space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    Skill Node Identification
                                </Label>
                                <Input
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    placeholder="e.g. Rust, Solidity, React..."
                                    className="h-12 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl focus:bg-muted/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-medium px-4"
                                    autoFocus
                                />
                            </div>
                            
                            <div className="w-full md:w-[220px] space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                                    Resonance Level
                                </Label>
                                <Select
                                    value={newSkillLevel}
                                    onValueChange={(val: any) => setNewSkillLevel(val)}
                                >
                                    <SelectTrigger className="h-12 bg-muted/50 border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium px-4">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover text-popover-foreground border-border backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden">
                                        {levels.map(l => (
                                            <SelectItem key={l} value={l} className="focus:bg-muted focus:text-foreground text-foreground transition-colors cursor-pointer rounded-lg mx-1 my-1">
                                                {l}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 flex-shrink-0">
                                <Button 
                                    onClick={handleSaveSkill} 
                                    disabled={!newSkillName.trim()}
                                    className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 font-bold tracking-wide flex-shrink-0 whitespace-nowrap"
                                >
                                    <Check className="w-4 h-4 mr-2" /> 
                                    Commit
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsAdding(false)} 
                                    className="h-12 w-12 p-0 rounded-xl border-border bg-muted/50 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/50 transition-all flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {levels.map(level => {
                    const skillsInLevel = localSkills.filter((s: any) => s.level === level)
                    if (skillsInLevel.length === 0 && !isEditing) return null

                    const levelColors = {
                        Expert: "text-purple-400 border-purple-500/20 bg-purple-500/5",
                        Advanced: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
                        Intermediate: "text-primary border-primary/20 bg-primary/5",
                        Beginner: "text-amber-400 border-amber-500/20 bg-amber-500/5"
                    }[level]

                    return (
                        <div key={level} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 whitespace-nowrap">{level} SYNCHRONIZATION</h3>
                                <div className="h-px w-full bg-muted/50" />
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {skillsInLevel.map((skill: any) => (
                                    <div
                                        key={skill.name}
                                        className={cn(
                                            "flex items-center gap-3 px-5 py-2.5 border rounded-2xl transition-all duration-300 cursor-default group hover:scale-105",
                                            levelColors
                                        )}
                                    >
                                        <span className="text-xs font-black tracking-tight">{skill.name}</span>
                                        {isEditing && (
                                            <button
                                                onClick={() => handleDeleteSkill(skill.name)}
                                                className="text-muted-foreground/50 hover:text-rose-500 transition-colors ml-1"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {skillsInLevel.length === 0 && (
                                    <p className="text-[10px] text-muted-foreground/30 italic font-black uppercase tracking-widest px-1">No data points.</p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

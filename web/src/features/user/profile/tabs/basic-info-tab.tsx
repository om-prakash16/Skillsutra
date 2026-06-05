import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UserProfile } from "@/types/profile"
import { Edit2, Save, X, Loader2 } from "lucide-react"

interface BasicInfoTabProps {
    data: UserProfile
    isEditing?: boolean
    onUpdate?: (field: string, value: string) => void
    onSave?: (sectionPayload: any) => Promise<void> | void
}

export function BasicInfoTab({ data, isEditing = false, onUpdate, onSave }: BasicInfoTabProps) {
    const [isEditingLocal, setIsEditingLocal] = useState(isEditing)
    const [isSaving, setIsSaving] = useState(false)

    const handleCommitChanges = async () => {
        setIsSaving(true)
        if (onSave) {
            await onSave({
                profile: {
                    full_name: `${data.basic.firstName} ${data.basic.lastName}`.trim(),
                    bio: data.basic.bio,
                    location: data.basic.location,
                    phone: data.basic.phone,
                    headline: data.basic.title,
                    experience_level: data.basic.experienceLevel,
                    job_type: data.basic.jobType,
                }
            })
        }
        setIsSaving(false)
        setIsEditingLocal(false)
    }

    return (
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pt-10 px-10">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Identity Matrix</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Synchronize your core professional credentials with the network.
                    </CardDescription>
                </div>
                {onSave && !isEditingLocal && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingLocal(true)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                )}
                {isEditingLocal && (
                    <div className="flex items-center gap-2">
                        <Button size="sm" disabled={isSaving} onClick={handleCommitChanges}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save
                        </Button>
                        <Button size="sm" variant="ghost" disabled={isSaving} onClick={() => setIsEditingLocal(false)}>
                            Cancel
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-10 px-10 pb-12">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Legal First Name</Label>
                        <Input 
                            id="firstName" 
                            defaultValue={data.basic.firstName} 
                            onChange={(e) => onUpdate?.('firstName', e.target.value)} 
                            disabled={!isEditingLocal} 
                            className="h-14 glass border-border rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Legal Last Name</Label>
                        <Input 
                            id="lastName" 
                            defaultValue={data.basic.lastName} 
                            onChange={(e) => onUpdate?.('lastName', e.target.value)} 
                            disabled={!isEditingLocal} 
                            className="h-14 glass border-border rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Primary Email Node</Label>
                        <Input 
                            id="email" 
                            defaultValue={data.basic.email} 
                            disabled 
                            className="h-14 bg-muted/50 border-border/50 rounded-2xl text-muted-foreground font-bold text-sm px-6 cursor-not-allowed" 
                        />
                        <p className="text-[9px] text-muted-foreground/50 italic font-black uppercase tracking-[0.1em] ml-1">Locked for security. Contact protocol admin to update.</p>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Communications Link</Label>
                        <Input 
                            id="phone" 
                            defaultValue={data.basic.phone} 
                            onChange={(e) => onUpdate?.('phone', e.target.value)} 
                            disabled={!isEditingLocal} 
                            className="h-14 glass border-border rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Neural Bio-Signature</Label>
                    <Textarea
                        id="bio"
                        defaultValue={data.basic.bio}
                        onChange={(e) => onUpdate?.('bio', e.target.value)}
                        className="min-h-[160px] glass border-border rounded-[2rem] focus:ring-primary/30 transition-all font-medium text-sm p-8 leading-relaxed"
                        placeholder="Define your professional resonance..."
                        disabled={!isEditingLocal}
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Geographic Node</Label>
                        <Input 
                            id="location" 
                            defaultValue={data.basic.location} 
                            onChange={(e) => onUpdate?.('location', e.target.value)} 
                            disabled={!isEditingLocal} 
                            className="h-14 glass border-border rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Resonance Level</Label>
                        <Input 
                            id="exp" 
                            defaultValue={data.basic.experienceLevel} 
                            onChange={(e) => onUpdate?.('experienceLevel', e.target.value)} 
                            disabled={!isEditingLocal} 
                            className="h-14 glass border-border rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Engagement Type</Label>
                        <Input 
                            id="type" 
                            defaultValue={data.basic.jobType} 
                            onChange={(e) => onUpdate?.('jobType', e.target.value)} 
                            disabled={!isEditingLocal} 
                            className="h-14 glass border-border rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

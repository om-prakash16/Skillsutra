"use client"

import { useState } from "react"
import { UserProfile, Recommendation } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquareQuote, Loader2, Plus, X, BadgeCheck } from "lucide-react"

interface Props {
    data: UserProfile
    onSave: (payload: any) => Promise<void>
}

export function RecommendationsTab({ data, onSave }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [recommendations, setRecommendations] = useState<Recommendation[]>(data.recommendations || [])
    const [isAdding, setIsAdding] = useState(false)

    const [newRec, setNewRec] = useState<Partial<Recommendation>>({
        author_name: "",
        author_role: "",
        author_company: "",
        relationship_type: "",
        content: ""
    })

    const handleSave = async (updatedRecs: Recommendation[]) => {
        setIsLoading(true)
        const lastAdded = updatedRecs[updatedRecs.length - 1]
        await onSave({
            type: "recommendation",
            data: lastAdded
        })
        setIsLoading(false)
        setIsAdding(false)
        setNewRec({
            author_name: "",
            author_role: "",
            author_company: "",
            relationship_type: "",
            content: ""
        })
    }

    const handleAdd = () => {
        if (!newRec.author_name || !newRec.author_role || !newRec.content || !newRec.relationship_type) return
        
        const recToAdd = { 
            ...newRec, 
            id: Math.random().toString(),
            is_verified: false,
            created_at: new Date().toISOString()
        } as Recommendation
        
        const updated = [...recommendations, recToAdd]
        setRecommendations(updated)
        handleSave(updated)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Recommendations</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add testimonials from colleagues and managers.</p>
                </div>
                {onSave && (
                    <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"} className="gap-2">
                        {isAdding ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4" />}
                        {isAdding ? "Cancel" : "Add Recommendation"}
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Author Name *</Label>
                                <Input placeholder="e.g. Jane Doe" value={newRec.author_name} onChange={(e) => setNewRec({...newRec, author_name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Author Role *</Label>
                                <Input placeholder="e.g. Senior Engineering Manager" value={newRec.author_role} onChange={(e) => setNewRec({...newRec, author_role: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Author Company</Label>
                                <Input placeholder="e.g. TechCorp" value={newRec.author_company} onChange={(e) => setNewRec({...newRec, author_company: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Relationship *</Label>
                                <Input placeholder="e.g. Jane managed me directly" value={newRec.relationship_type} onChange={(e) => setNewRec({...newRec, relationship_type: e.target.value})} />
                            </div>
                            <div className="col-span-full space-y-2">
                                <Label>Recommendation Text *</Label>
                                <Textarea 
                                    placeholder="Write the recommendation here..." 
                                    className="min-h-[120px]"
                                    value={newRec.content} 
                                    onChange={(e) => setNewRec({...newRec, content: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button onClick={handleAdd} disabled={!newRec.author_name || !newRec.author_role || !newRec.content || !newRec.relationship_type || isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                                Save Recommendation
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {recommendations.length === 0 && !isAdding && onSave && (
                    <div className="col-span-full py-12 text-center border rounded-2xl border-dashed">
                        <MessageSquareQuote className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h4 className="text-lg font-medium">No Recommendations</h4>
                        <p className="text-muted-foreground">Add testimonials from people you've worked with.</p>
                    </div>
                )}
                {recommendations.map(rec => (
                    <Card key={rec.id} className="glass">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 items-center justify-center text-primary font-bold text-xl uppercase">
                                    {rec.author_name.charAt(0)}
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-lg">{rec.author_name}</h4>
                                            {rec.is_verified && <BadgeCheck className="w-4 h-4 text-green-500" />}
                                        </div>
                                        <p className="text-sm font-medium text-foreground/80">
                                            {rec.author_role} {rec.author_company && <span>at {rec.author_company}</span>}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{rec.relationship_type}</p>
                                    </div>
                                    <div className="relative">
                                        <MessageSquareQuote className="w-8 h-8 text-muted-foreground/10 absolute -top-2 -left-2 z-0" />
                                        <p className="text-muted-foreground relative z-10 pl-4 border-l-2 border-primary/20 italic">
                                            "{rec.content}"
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground/50 pt-2">
                                        Added on {new Date(rec.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

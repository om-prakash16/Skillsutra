"use client"

import { useState } from "react"
import { UserProfile, HiringPreference } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, DollarSign, MapPin, Loader2, Plus, X } from "lucide-react"

interface Props {
    data: UserProfile
    onSave: (payload: any) => Promise<void>
}

export function HiringPreferencesTab({ data, onSave }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [preferences, setPreferences] = useState<Partial<HiringPreference>>(
        data.hiring_preferences || {
            is_open_to_work: false,
            expected_salary_min: undefined,
            expected_salary_max: undefined,
            preferred_locations: [],
            willing_to_relocate: false,
            preferred_roles: [],
            requires_sponsorship: false
        }
    )

    const [newRole, setNewRole] = useState("")
    const [newLocation, setNewLocation] = useState("")

    const handleSave = async () => {
        setIsLoading(true)
        await onSave({
            type: "hiring_preferences",
            data: preferences
        })
        setIsLoading(false)
    }

    const addRole = () => {
        if (!newRole.trim()) return
        setPreferences(prev => ({
            ...prev,
            preferred_roles: [...(prev.preferred_roles || []), newRole.trim()]
        }))
        setNewRole("")
    }

    const removeRole = (role: string) => {
        setPreferences(prev => ({
            ...prev,
            preferred_roles: prev.preferred_roles?.filter(r => r !== role)
        }))
    }

    const addLocation = () => {
        if (!newLocation.trim()) return
        setPreferences(prev => ({
            ...prev,
            preferred_locations: [...(prev.preferred_locations || []), newLocation.trim()]
        }))
        setNewLocation("")
    }

    const removeLocation = (loc: string) => {
        setPreferences(prev => ({
            ...prev,
            preferred_locations: prev.preferred_locations?.filter(l => l !== loc)
        }))
    }

    return (
        <Card className="glass border-border/50">
            <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">Hiring Preferences</h3>
                        <p className="text-sm text-muted-foreground mt-1">Let recruiters know what you're looking for.</p>
                    </div>
                    <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Preferences
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Status & Sponsorship */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Open to Work</Label>
                                <p className="text-sm text-muted-foreground">Show recruiters you are actively looking</p>
                            </div>
                            <Switch 
                                checked={preferences.is_open_to_work} 
                                onCheckedChange={(c) => setPreferences({ ...preferences, is_open_to_work: c })} 
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                            <div className="space-y-0.5">
                                <Label>Willing to Relocate</Label>
                                <p className="text-sm text-muted-foreground">Open to moving for the right role</p>
                            </div>
                            <Switch 
                                checked={preferences.willing_to_relocate} 
                                onCheckedChange={(c) => setPreferences({ ...preferences, willing_to_relocate: c })} 
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                            <div className="space-y-0.5">
                                <Label>Requires Visa Sponsorship</Label>
                                <p className="text-sm text-muted-foreground">Will you need sponsorship now or in the future?</p>
                            </div>
                            <Switch 
                                checked={preferences.requires_sponsorship} 
                                onCheckedChange={(c) => setPreferences({ ...preferences, requires_sponsorship: c })} 
                            />
                        </div>
                    </div>

                    {/* Salary & Arrays */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2"><DollarSign className="w-4 h-4"/> Expected Salary (USD)</Label>
                            <div className="flex items-center gap-4">
                                <Input 
                                    type="number" 
                                    placeholder="Min (e.g. 100000)" 
                                    value={preferences.expected_salary_min || ""} 
                                    onChange={(e) => setPreferences({ ...preferences, expected_salary_min: parseInt(e.target.value) || undefined })}
                                />
                                <span className="text-muted-foreground">to</span>
                                <Input 
                                    type="number" 
                                    placeholder="Max (e.g. 150000)" 
                                    value={preferences.expected_salary_max || ""} 
                                    onChange={(e) => setPreferences({ ...preferences, expected_salary_max: parseInt(e.target.value) || undefined })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> Preferred Roles</Label>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="e.g. Frontend Engineer" 
                                    value={newRole} 
                                    onChange={(e) => setNewRole(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addRole()}
                                />
                                <Button type="button" variant="secondary" onClick={addRole}><Plus className="w-4 h-4"/></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {preferences.preferred_roles?.map((role) => (
                                    <div key={role} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                        {role}
                                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeRole(role)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Preferred Locations</Label>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="e.g. Remote, New York, London" 
                                    value={newLocation} 
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                                />
                                <Button type="button" variant="secondary" onClick={addLocation}><Plus className="w-4 h-4"/></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {preferences.preferred_locations?.map((loc) => (
                                    <div key={loc} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                                        {loc}
                                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeLocation(loc)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

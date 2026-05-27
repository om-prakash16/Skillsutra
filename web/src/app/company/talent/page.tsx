"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, MapPin, Briefcase } from "lucide-react"
import { useState, useEffect } from "react"
import { publicApi } from "@/lib/api/public-api"

export default function TalentBrowsingPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [talents, setTalents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTalent()
    }, [])

    const fetchTalent = async () => {
        setIsLoading(true)
        try {
            const response = await publicApi.search.candidates("")
            const candidates = response.data?.candidates || response.data || []
            const data = (Array.isArray(candidates) ? candidates : []).map((c: any) => ({
                id: c.user_id,
                name: c.full_name,
                title: c.headline || "Professional",
                role: c.primary_role || "Developer",
                avatar: "", 
                location: c.location || "Remote",
                experience: `${c.experience_years || 0} Years`,
                experienceLevel: (c.experience_years || 0) > 5 ? "Senior" : "Intermediate",
                skills: c.skills || [],
            }))
            setTalents(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredTalent = talents?.filter(talent =>
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading tracking-tight">Browse Talent</h1>
                <p className="text-muted-foreground">Discover top developers and engineers.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, role, or skill..."
                    className="pl-10 max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="py-12 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTalent?.map((profile) => (
                        <Card key={profile.id} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} />
                                        <AvatarFallback>{profile.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <Badge variant="secondary" className="font-normal">
                                        {profile.experience}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{profile.name}</h3>
                                    <p className="text-sm font-medium text-foreground/80">{profile.role}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <MapPin className="w-3 h-3" />
                                        {profile.location}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.slice(0, 4).map((skill: string) => (
                                        <Badge key={skill} variant="outline" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {profile.skills.length > 4 && (
                                        <Badge variant="outline" className="text-xs">+{profile.skills.length - 4}</Badge>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <Button variant="outline" className="w-full">View Profile</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredTalent?.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            No talent found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

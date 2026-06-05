import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Check, Link as LinkIcon, Trash2, ExternalLink } from "lucide-react"
import { useState } from "react"
import { UserProfile } from "@/types/profile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import Link from "next/link"
import { useEffect } from "react"
import { Edit, Save, Loader2 } from "lucide-react"

export interface SocialLink {
    platform: string
    url: string
}

interface AccountsTabProps {
    data: UserProfile
    onSave?: (payload: any) => Promise<void>
}

const BRAND_CONFIG: Record<string, { bg: string, text: string, border: string }> = {
    "GitHub": { bg: "bg-slate-900 dark:bg-slate-800", text: "text-white", border: "border-slate-800 dark:border-slate-700" },
    "GitLab": { bg: "bg-[#FCA326]/10", text: "text-[#FCA326]", border: "border-[#FCA326]/20" },
    "LeetCode": { bg: "bg-[#FFA116]/10", text: "text-[#FFA116]", border: "border-[#FFA116]/20" },
    "Codeforces": { bg: "bg-blue-600/10", text: "text-blue-500", border: "border-blue-500/20" },
    "HackerRank": { bg: "bg-[#2EC866]/10", text: "text-[#2EC866]", border: "border-[#2EC866]/20" },
    "Stack Overflow": { bg: "bg-[#F48024]/10", text: "text-[#F48024]", border: "border-[#F48024]/20" },
    
    "Behance": { bg: "bg-[#1769FF]/10", text: "text-[#1769FF]", border: "border-[#1769FF]/20" },
    "Dribbble": { bg: "bg-[#EA4C89]/10", text: "text-[#EA4C89]", border: "border-[#EA4C89]/20" },
    "Figma": { bg: "bg-[#F24E1E]/10", text: "text-[#F24E1E]", border: "border-[#F24E1E]/20" },
    "ArtStation": { bg: "bg-[#13AFF0]/10", text: "text-[#13AFF0]", border: "border-[#13AFF0]/20" },
    "Adobe Portfolio": { bg: "bg-[#FF0000]/10", text: "text-[#FF0000]", border: "border-[#FF0000]/20" },
    
    "Medium": { bg: "bg-foreground/5", text: "text-foreground", border: "border-border" },
    "Substack": { bg: "bg-[#FF6719]/10", text: "text-[#FF6719]", border: "border-[#FF6719]/20" },
    "Dev.to": { bg: "bg-foreground/5", text: "text-foreground", border: "border-border" },
    "Personal Blog": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
    
    "Kaggle": { bg: "bg-[#20BEFF]/10", text: "text-[#20BEFF]", border: "border-[#20BEFF]/20" },
    "Hugging Face": { bg: "bg-[#FFD21E]/10", text: "text-[#FFD21E]", border: "border-[#FFD21E]/20" },
    "Papers With Code": { bg: "bg-[#24B2AB]/10", text: "text-[#24B2AB]", border: "border-[#24B2AB]/20" },
    
    "YouTube": { bg: "bg-[#FF0000]/10", text: "text-[#FF0000]", border: "border-[#FF0000]/20" },
    "Vimeo": { bg: "bg-[#1AB7EA]/10", text: "text-[#1AB7EA]", border: "border-[#1AB7EA]/20" },
    
    "LinkedIn": { bg: "bg-[#0A66C2]/10", text: "text-[#0A66C2]", border: "border-[#0A66C2]/20" },
    "Personal Website": { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
    "Portfolio Website": { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/20" },
}

const CATEGORIES = [
    {
      name: "Development",
      platforms: ["GitHub", "GitLab", "LeetCode", "Codeforces", "HackerRank", "Stack Overflow"]
    },
    {
      name: "Design",
      platforms: ["Behance", "Dribbble", "Figma", "ArtStation", "Adobe Portfolio"]
    },
    {
      name: "Content & Writing",
      platforms: ["Medium", "Substack", "Dev.to", "Personal Blog"]
    },
    {
      name: "Data & AI",
      platforms: ["Kaggle", "Hugging Face", "Papers With Code"]
    },
    {
      name: "Video & Creative",
      platforms: ["YouTube", "Vimeo", "Portfolio Website"]
    },
    {
      name: "General",
      platforms: ["LinkedIn", "Personal Website"]
    }
]

export function AccountsTab({ data, onSave }: AccountsTabProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [newPlatform, setNewPlatform] = useState("")
    const [newUrl, setNewUrl] = useState("")
    
    const [localSocialLinks, setLocalSocialLinks] = useState<SocialLink[]>(data.socialLinks || [])
    
    useEffect(() => {
        setLocalSocialLinks(data.socialLinks || [])
    }, [data.socialLinks])

    const handleSaveLink = () => {
        if (newPlatform.trim() && newUrl.trim()) {
            setLocalSocialLinks([...localSocialLinks, { platform: newPlatform, url: newUrl }])
            setNewPlatform("")
            setNewUrl("")
            setIsAdding(false)
        }
    }

    const handleRemoveLink = (index: number) => {
        const newLinks = [...localSocialLinks]
        newLinks.splice(index, 1)
        setLocalSocialLinks(newLinks)
    }

    const handleCommitChanges = async () => {
        setIsSaving(true)
        if (onSave) {
            await onSave({
                socialLinks: localSocialLinks.map(l => ({
                    platform: l.platform,
                    url: l.url
                }))
            })
        }
        setIsSaving(false)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setLocalSocialLinks(data.socialLinks || [])
        setIsAdding(false)
        setIsEditing(false)
    }

    // Group active links by category
    const activeLinksByCategory = CATEGORIES.map(cat => {
        return {
            name: cat.name,
            links: localSocialLinks.filter(l => cat.platforms.includes(l.platform))
        }
    }).filter(cat => cat.links.length > 0)
    
    // Add "Other" category for platforms not in predefined list
    const predefinedPlatforms = CATEGORIES.flatMap(c => c.platforms)
    const otherLinks = localSocialLinks.filter(l => !predefinedPlatforms.includes(l.platform))
    if (otherLinks.length > 0) {
        activeLinksByCategory.push({ name: "Other Links", links: otherLinks })
    }

    return (
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pt-10 px-10">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Professional Accounts</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Your digital footprint across the ecosystem.
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
                                Add Profile
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
                    <div className="p-6 md:p-8 rounded-[2rem] bg-background/80 border border-border backdrop-blur-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300 mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                        
                        <div className="relative flex flex-col md:flex-row items-end gap-4">
                            <div className="w-full md:w-[250px] space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    Platform
                                </label>
                                <Select value={newPlatform} onValueChange={setNewPlatform}>
                                    <SelectTrigger className="h-12 bg-muted/50 border-border text-foreground rounded-xl focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium px-4">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {CATEGORIES.map(cat => (
                                            <SelectGroup key={cat.name}>
                                                <SelectLabel className="font-bold text-primary/70">{cat.name}</SelectLabel>
                                                {cat.platforms.map(p => (
                                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex-1 w-full space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                                    Profile URL or Username
                                </label>
                                <Input
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="https://github.com/username"
                                    className="h-12 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl focus:bg-muted/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-medium px-4"
                                />
                            </div>
                            
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 flex-shrink-0">
                                <Button 
                                    onClick={handleSaveLink} 
                                    disabled={!newPlatform || !newUrl.trim()}
                                    className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 font-bold tracking-wide flex-shrink-0 whitespace-nowrap"
                                >
                                    <Check className="w-4 h-4 mr-2" /> 
                                    Save Profile
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => { setIsAdding(false); setNewPlatform(""); setNewUrl(""); }}
                                    className="h-12 px-4 rounded-xl text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {!localSocialLinks.length && !isAdding && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <LinkIcon className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">No profiles connected</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Connect your GitHub, LinkedIn, Behance, or other platforms to showcase your digital presence.
                        </p>
                        {isEditing && (
                            <Button onClick={() => setIsAdding(true)} variant="outline" className="rounded-xl border-dashed">
                                <Plus className="w-4 h-4 mr-2" /> Add Your First Profile
                            </Button>
                        )}
                    </div>
                )}

                <div className="space-y-8">
                    {activeLinksByCategory.map(category => (
                        <div key={category.name} className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-2">
                                {category.name}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {category.links.map((link, idx) => {
                                    const style = BRAND_CONFIG[link.platform] || { bg: "bg-muted", text: "text-foreground", border: "border-border" }
                                    const originalIndex = localSocialLinks.indexOf(link)
                                    
                                    return (
                                        <div key={idx} className="relative group">
                                            <Link 
                                                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer" 
                                                className={`flex items-center justify-between p-4 rounded-2xl border ${style.border} ${style.bg} hover:brightness-110 transition-all block`}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <span className={`font-bold text-sm truncate ${style.text}`}>
                                                        {link.platform}
                                                    </span>
                                                </div>
                                                <ExternalLink className={`w-4 h-4 ${style.text} opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0`} />
                                            </Link>
                                            
                                            {isEditing && (
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-75 group-hover:scale-100"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRemoveLink(originalIndex);
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

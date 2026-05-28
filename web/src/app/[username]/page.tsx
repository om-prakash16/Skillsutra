import { Metadata } from "next"
import { notFound } from "next/navigation"
import { api } from "@/lib/api/api-client"
import { ProfileHeader } from "@/features/profile/components/profile-header"
import { ProfileEditButton } from "@/features/profile/components/profile-edit-button"
import { ShieldCheck, Calendar, MapPin, Link as LinkIcon, Code2, Award, Briefcase, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PageProps {
    params: {
        username: string
    }
}

// Fetch the profile dynamically using server-side fetching
async function getProfile(username: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"}/profiles/public/${username}`, {
            // We can pass cached config or revalidate here
            next: { revalidate: 60 }
        })
        if (!response.ok) return null
        const json = await response.json()
        return json.data
    } catch (e) {
        return null
    }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const profile = await getProfile(params.username)
    
    if (!profile) {
        return { title: "Profile Not Found | SkillSutra" }
    }
    
    return {
        title: `${profile.username} - ${profile.headline || 'Developer'} | SkillSutra Profile`,
        description: profile.about || `Check out ${profile.username}'s verified professional profile on SkillSutra.`,
        openGraph: {
            title: `${profile.username} | SkillSutra`,
            description: profile.about || "Verified Professional Profile",
            images: [
                {
                    url: profile.banner_url || "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Profile Banner",
                }
            ]
        }
    }
}

export default async function PublicProfilePage({ params }: PageProps) {
    const profile = await getProfile(params.username)
    
    if (!profile) {
        notFound()
    }

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-24 pt-16 px-4 md:px-8 relative overflow-hidden">
            <ProfileEditButton username={profile.username} />

            {/* Banner & Avatar (Minimal mock of ProfileHeader or custom build) */}
            <div className="relative">
                <div className="h-48 md:h-64 w-full rounded-3xl overflow-hidden glass border-white/10 relative">
                    {profile.banner_url ? (
                        <img src={profile.banner_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-emerald-500/20 animate-pulse" />
                    )}
                </div>
                
                <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#030712] bg-card overflow-hidden relative shadow-2xl z-10 flex items-center justify-center">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-4xl font-black text-primary/50 uppercase tracking-widest">
                                {profile.username.substring(0, 2)}
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-4 space-y-1 z-10 hidden sm:block">
                        <h1 className="text-3xl font-black font-heading tracking-tight flex items-center gap-2">
                            {profile.username} <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        </h1>
                        <p className="text-sm font-black uppercase tracking-widest text-white/50">{profile.headline || 'Developer'}</p>
                    </div>
                </div>
            </div>
            
            <div className="pt-20 sm:hidden">
                <h1 className="text-3xl font-black font-heading tracking-tight flex items-center gap-2">
                    {profile.username} <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </h1>
                <p className="text-sm font-black uppercase tracking-widest text-white/50">{profile.headline || 'Developer'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    {profile.about && (
                        <div className="glass p-8 rounded-3xl border-white/5 space-y-4">
                            <h2 className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-primary" /> About
                            </h2>
                            <p className="text-white/70 leading-relaxed text-sm">
                                {profile.about}
                            </p>
                        </div>
                    )}
                    
                    {/* Projects Section (Placeholder structure based on ledger) */}
                    <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-primary" /> Project Ledger
                        </h2>
                        
                        {profile.projects && profile.projects.length > 0 ? (
                            <div className="space-y-4">
                                {/* Map projects here */}
                            </div>
                        ) : (
                            <div className="text-center py-12 border border-white/5 border-dashed rounded-2xl">
                                <p className="text-xs font-black uppercase tracking-widest text-white/30">No public projects available.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="space-y-8">
                    {/* Social & Contact */}
                    <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Social Nexus</h2>
                        <div className="space-y-4">
                            {profile.social_links?.github && (
                                <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-white/60 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-white/50">GitHub</p>
                                        <p className="text-sm text-white/90 truncate max-w-[150px]">View Source</p>
                                    </div>
                                </a>
                            )}
                            {profile.social_links?.linkedin && (
                                <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#0077b5]/20 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-white/60 group-hover:text-[#0077b5] transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-white/50">LinkedIn</p>
                                        <p className="text-sm text-white/90 truncate max-w-[150px]">View Profile</p>
                                    </div>
                                </a>
                            )}
                            {profile.social_links?.portfolio && (
                                <a href={profile.social_links.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-white/60 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-white/50">Portfolio</p>
                                        <p className="text-sm text-white/90 truncate max-w-[150px]">{profile.social_links.portfolio.replace(/^https?:\/\//, '')}</p>
                                    </div>
                                </a>
                            )}
                            
                            {(!profile.social_links || Object.keys(profile.social_links).length === 0) && (
                                <p className="text-xs font-black uppercase tracking-widest text-white/30 text-center">No social links configured</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

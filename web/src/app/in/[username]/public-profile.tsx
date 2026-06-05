"use client"

import { use } from "react"

import { useQuery } from "@tanstack/react-query"
import { PublicProfileHeader } from "@/features/user/profile/public-profile-header"
import { SkillsTab } from "@/features/user/profile/tabs/skills-tab"
import { ExperienceTab } from "@/features/user/profile/tabs/experience-tab"
import { EducationTab } from "@/features/user/profile/tabs/education-tab"
import { ProjectsTab } from "@/features/user/profile/tabs/projects-tab"
import { GithubTab } from "@/features/user/profile/tabs/github-tab"
import { LeetcodeTab } from "@/features/user/profile/tabs/leetcode-tab"
import { AccountsTab } from "@/features/user/profile/tabs/accounts-tab"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { publicApi } from "@/lib/api/public-api"

// Fetch function that gets specific user by ID from real backend
const fetchTalentProfileById = async (id: string): Promise<any | null> => {
    try {
        const response = await publicApi.profile.getById(id)
        if (!response) return null
        
        const data = response
        const profile = data.profile || {}
        
        return {
            ...data,
            basic: {
                firstName: profile.full_name ? profile.full_name.split(" ")[0] : (profile.username || "Anonymous"),
                lastName: profile.full_name ? profile.full_name.split(" ").slice(1).join(" ") : "",
                title: profile.headline || "Professional",
                location: profile.location || "Remote",
                avatar: profile.avatar_url || "",
                experienceLevel: data.experiences?.length > 2 ? "Senior" : "Intermediate",
                completion: profile.completion_percent || 80,
                bio: profile.bio || "",
                email: profile.email || "",
                phone: profile.phone || "",
                jobType: profile.job_type || "Full-time",
                languages: profile.languages || [],
                joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "",
            },
            socialLinks: profile.dynamic_profile_data?.socialLinks || [],
            dynamicSections: profile.dynamic_profile_data?.customSections || [],
            skills: (data.skills || []).map((s: any) => ({
                name: s.name,
                level: s.proficiency || "Intermediate",
                category: s.category,
                is_verified: s.verified
            })),
            experience: (data.experiences || []).map((e: any) => ({
                id: e.id,
                role: e.role,
                company: e.company_name,
                type: (e.employment_type || e.type || "Full-time"),
                startDate: e.start_date,
                endDate: e.end_date || "Present",
                description: e.description
            })),
            education: (data.education || []).map((e: any) => ({
                id: e.id,
                institution: e.institution,
                degree: e.degree,
                year: e.end_date ? new Date(e.end_date).getFullYear().toString() : "",
                fieldOfStudy: e.field_of_study
            })),
            projects: (data.projects || []).map((p: any) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                stack: p.stack || [],
                link: p.project_url,
                github: p.github_url
            }))
        }
    } catch (err) {
        console.error(err)
        return null
    }
}

export default function PublicProfile({ talentId }: { talentId: string }) {
    const { data: userProfile, isLoading, isError } = useQuery({
        queryKey: ["talentProfile", talentId],
        queryFn: () => fetchTalentProfileById(talentId),
    })

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!userProfile || isError) {
        return notFound()
    }

    return (
        <div className="min-h-screen relative selection:bg-primary/30">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 space-y-12 max-w-7xl mx-auto pb-24 pt-8 px-4 sm:px-6 lg:px-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <PublicProfileHeader user={{ ...userProfile.basic, id: userProfile.profile?.user_id }} />
                </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left Column - Quick Facts & Basics */}
                <div className="xl:col-span-4 space-y-10 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
                    <div className="sticky top-24 space-y-10">
                        {userProfile.socialLinks?.length > 0 && (
                            <AccountsTab data={userProfile} />
                        )}
                        {userProfile.skills?.length > 0 && (
                            <SkillsTab data={userProfile} />
                        )}
                        {userProfile.education?.length > 0 && (
                            <EducationTab data={userProfile} />
                        )}
                    </div>
                </div>

                {/* Right Column - Deep Dive */}
                <div className="xl:col-span-8 space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                    {userProfile.basic?.bio && (
                        <div className="glass border-border/50 rounded-[2.5rem] p-10 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            <h3 className="text-2xl font-black uppercase italic tracking-tight mb-6">Executive Summary</h3>
                            <p className="text-foreground/80 leading-[1.8] text-sm font-medium italic">
                                {userProfile.basic.bio}
                            </p>
                        </div>
                    )}
                    
                    {userProfile.experience?.length > 0 && (
                        <ExperienceTab data={userProfile} />
                    )}
                    
                    {userProfile.projects?.length > 0 && (
                        <ProjectsTab data={userProfile} />
                    )}
                    
                    {(userProfile.github?.username || userProfile.leetcode?.username) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {userProfile.github?.username && <GithubTab data={userProfile} />}
                            {userProfile.leetcode?.username && <LeetcodeTab data={userProfile} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    )
}

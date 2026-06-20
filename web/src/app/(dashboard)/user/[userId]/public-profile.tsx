"use client"

import { use } from "react"

import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PublicProfileHeader } from "@/features/user/profile/public-profile-header"
import { OverviewTab } from "@/features/user/profile/tabs/overview-tab"
import { SkillsTab } from "@/features/user/profile/tabs/skills-tab"
import { ExperienceTab } from "@/features/user/profile/tabs/experience-tab"
import { EducationTab } from "@/features/user/profile/tabs/education-tab"
import { ProjectsTab } from "@/features/user/profile/tabs/projects-tab"
import { GithubTab } from "@/features/user/profile/tabs/github-tab"
import { LeetcodeTab } from "@/features/user/profile/tabs/leetcode-tab"
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
                joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : ""
            },
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
                type: (e.type || "Full-time"),
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
        <div className="space-y-6 max-w-5xl mx-auto pb-12 pt-8 px-4">
            <div>
                <PublicProfileHeader user={{ ...userProfile.basic, id: userProfile.profile?.user_id || talentId }} />
            </div>
            <Tabs defaultValue="overview" className="space-y-6">
                <div className="overflow-x-auto pb-2 scrollbar-hide">
                    <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none gap-2">
                        <TabsTrigger value="overview" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Overview</TabsTrigger>
                        <TabsTrigger value="skills" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Skills</TabsTrigger>
                        <TabsTrigger value="experience" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Experience</TabsTrigger>
                        <TabsTrigger value="education" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Education</TabsTrigger>
                        <TabsTrigger value="projects" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Projects</TabsTrigger>
                        <TabsTrigger value="github" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">GitHub</TabsTrigger>
                        <TabsTrigger value="leetcode" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">LeetCode</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="animate-in fade-in-50 duration-300">
                    <OverviewTab data={userProfile} />
                </TabsContent>
                <TabsContent value="skills" className="animate-in fade-in-50 duration-300">
                    <SkillsTab data={userProfile} />
                </TabsContent>
                <TabsContent value="experience" className="animate-in fade-in-50 duration-300">
                    <ExperienceTab data={userProfile} />
                </TabsContent>
                <TabsContent value="education" className="animate-in fade-in-50 duration-300">
                    <EducationTab data={userProfile} />
                </TabsContent>
                <TabsContent value="projects" className="animate-in fade-in-50 duration-300">
                    <ProjectsTab data={userProfile} />
                </TabsContent>
                <TabsContent value="github" className="animate-in fade-in-50 duration-300">
                    <GithubTab data={userProfile} />
                </TabsContent>
                <TabsContent value="leetcode" className="animate-in fade-in-50 duration-300">
                    <LeetcodeTab data={userProfile} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

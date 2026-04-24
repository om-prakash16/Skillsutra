"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userApi } from "@/lib/api/user-api";
import SkillGraphVisualization from "@/components/skills/SkillGraphVisualization";
import SkillManagementPanel from "@/components/skills/SkillManagementPanel";
import AISkillExtractorWizard from "@/components/skills/AISkillExtractorWizard";
import SkillGapAnalyzer from "@/components/skills/SkillGapAnalyzer";
import { ProjectLedgerList } from "@/components/projects/ProjectLedgerList";
import { AddProjectModal } from "@/components/projects/AddProjectModal";
import { GitHubSyncWizard } from "@/components/projects/GitHubSyncWizard";
import { Plus, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SkillNode {
  id: string;
  skill_id: string;
  skill_name: string;
  skill_category: string;
  proficiency_level: string;
  proficiency_score: number;
  proof_score: number;
  is_primary: boolean;
  is_verified: boolean;
  endorsement_count: number;
  source: string;
  years_experience: number;
  projects: { title: string; github_url?: string }[];
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("graph");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await userApi.skillGraph.getMySkills();
      setSkills(res?.nodes || []);
    } catch (e) {
      console.error("Failed to fetch skills:", e);
    }
    setLoading(false);
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await userApi.jobs.list();
      setJobs(
        (res?.jobs || res?.data || []).map((j: any) => ({ id: j.id, title: j.title }))
      );
    } catch { /* ignore */ }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await userApi.projects.list();
      setProjects(res || []);
    } catch (e) {
      console.error("Failed to fetch projects:", e);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
    fetchJobs();
    fetchProjects();
  }, [fetchSkills, fetchJobs, fetchProjects]);

  // Stats
  const totalSkills = skills.length;
  const verifiedSkills = skills.filter((s) => s.is_verified).length;
  const primarySkills = skills.filter((s) => s.is_primary).length;
  const avgProof = totalSkills ? Math.round(skills.reduce((a, s) => a + s.proof_score, 0) / totalSkills) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skill Graph</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Build your proof-based skill identity. Add, verify, and visualize your competencies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1 border-cyan-500/20 text-cyan-400">
            {totalSkills} Skills
          </Badge>
          <Badge variant="outline" className="text-xs px-3 py-1 border-green-500/20 text-green-400">
            {verifiedSkills} Verified
          </Badge>
          <Badge variant="outline" className="text-xs px-3 py-1 border-amber-500/20 text-amber-400">
            {avgProof}% Avg Proof
          </Badge>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Skills", value: totalSkills, color: "text-cyan-400", icon: "🧠" },
          { label: "Verified", value: verifiedSkills, color: "text-green-400", icon: "✓" },
          { label: "Primary", value: primarySkills, color: "text-amber-400", icon: "★" },
          { label: "Avg Proof Score", value: `${avgProof}%`, color: "text-purple-400", icon: "📊" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-zinc-950/50 border border-white/5 backdrop-blur-sm"
          >
            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span>{stat.icon}</span> {stat.label}
            </div>
            <div className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-zinc-900/50 border border-white/5">
          <TabsTrigger value="graph" className="text-xs">
            🌐 Graph View
          </TabsTrigger>
          <TabsTrigger value="manage" className="text-xs">
            ⚙️ Manage
          </TabsTrigger>
          <TabsTrigger value="extract" className="text-xs">
            ⚡ AI Extract
          </TabsTrigger>
          <TabsTrigger value="gaps" className="text-xs">
            🎯 Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs">
            📂 Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="mt-0">
          <div className="rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
            {loading ? (
              <div className="h-[500px] flex items-center justify-center text-zinc-500 text-sm animate-pulse">
                Loading skill graph...
              </div>
            ) : skills.length === 0 ? (
              <div className="h-[500px] flex flex-col items-center justify-center text-zinc-500 text-sm gap-3">
                <span className="text-4xl">🧠</span>
                <p>No skills yet. Add skills or use AI extraction to get started.</p>
              </div>
            ) : (
              <div className="h-[500px]">
                <SkillGraphVisualization
                  nodes={skills}
                  onNodeClick={(node) => {
                    setActiveTab("manage");
                  }}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-0">
          <SkillManagementPanel skills={skills} onRefresh={fetchSkills} />
        </TabsContent>

        <TabsContent value="extract" className="mt-0">
          <AISkillExtractorWizard onComplete={fetchSkills} />
        </TabsContent>

        <TabsContent value="gaps" className="mt-0">
          <SkillGapAnalyzer jobs={jobs} />
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Verified Proof-of-Work</h2>
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Project
                </Button>
              </div>
              <ProjectLedgerList projects={projects} onRefresh={fetchProjects} />
            </div>
            <div className="space-y-6">
              <GitHubSyncWizard onSuccess={fetchProjects} />
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                  💡 Skill Boost Tip
                </h4>
                <p className="text-xs text-blue-300/80 leading-relaxed">
                  Linking projects to your skills is the fastest way to increase your <strong>Proof Score</strong>. Verified repositories count for 2x weight!
                </p>
              </div>
            </div>
          </div>
          <AddProjectModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onSuccess={fetchProjects} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

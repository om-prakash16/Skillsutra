"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { userApi } from "@/lib/api/user-api";

interface SkillNode {
  id: string;
  skill_id: string;
  skill_name: string;
  skill_category: string;
  proficiency_level: string;
  proof_score: number;
  is_primary: boolean;
  is_verified: boolean;
  endorsement_count: number;
  source: string;
  years_experience: number;
}

interface TaxonomySkill {
  id: string;
  name: string;
  slug: string;
  category: string;
  popularity_score: number;
}

export default function SkillManagementPanel({
  skills,
  onRefresh,
}: {
  skills: SkillNode[];
  onRefresh: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TaxonomySkill[]>([]);
  const [selectedProficiency, setSelectedProficiency] = useState("intermediate");
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Debounced taxonomy search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await userApi.skillGraph.searchTaxonomy(searchQuery);
        setSearchResults(res?.results || []);
      } catch { setSearchResults([]); }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleAddSkill = useCallback(
    async (taxonomySkill: TaxonomySkill) => {
      setIsAdding(true);
      try {
        await userApi.skillGraph.addSkill({
          skill_id: taxonomySkill.id,
          proficiency_level: selectedProficiency,
        });
        setSearchQuery("");
        setSearchResults([]);
        onRefresh();
      } catch (e) {
        console.error("Failed to add skill:", e);
      }
      setIsAdding(false);
    },
    [selectedProficiency, onRefresh]
  );

  const handleRemoveSkill = useCallback(
    async (nodeId: string) => {
      try {
        await userApi.skillGraph.removeSkill(nodeId);
        onRefresh();
      } catch (e) {
        console.error("Failed to remove skill:", e);
      }
    },
    [onRefresh]
  );

  const handleTogglePrimary = useCallback(
    async (nodeId: string, current: boolean) => {
      try {
        await userApi.skillGraph.updateSkill(nodeId, { is_primary: !current });
        onRefresh();
      } catch (e) {
        console.error("Failed to update skill:", e);
      }
    },
    [onRefresh]
  );

  const categoryColor: Record<string, string> = {
    language: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    framework: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    tool: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    database: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cloud: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    concept: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    ai_ml: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    soft_skill: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  return (
    <Card className="border-white/5 bg-zinc-950/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Skill Manager</span>
          <Badge variant="outline" className="text-xs font-mono">
            {skills.length} skills
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search + Add */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search skills to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border-white/10"
            />
            {/* Dropdown results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl max-h-[200px] overflow-y-auto">
                {searchResults.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleAddSkill(s)}
                    disabled={isAdding || skills.some((sk) => sk.skill_id === s.id)}
                    className="w-full px-3 py-2 text-left hover:bg-white/5 flex items-center justify-between text-sm disabled:opacity-40"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColor[s.category] || "bg-zinc-800 text-zinc-400"}`}>
                      {s.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-zinc-900 border border-white/10 rounded-lg p-3 text-center text-sm text-zinc-500">
                Searching taxonomy...
              </div>
            )}
          </div>
          <Select value={selectedProficiency} onValueChange={setSelectedProficiency}>
            <SelectTrigger className="w-[140px] bg-zinc-900/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skills list */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all group"
            >
              {/* Star toggle */}
              <button
                onClick={() => handleTogglePrimary(skill.id, skill.is_primary)}
                className={`text-lg transition-colors ${skill.is_primary ? "text-amber-400" : "text-zinc-600 hover:text-amber-400/60"}`}
                title={skill.is_primary ? "Primary skill" : "Mark as primary"}
              >
                ★
              </button>

              {/* Skill info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{skill.skill_name}</span>
                  {skill.is_verified && (
                    <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/20">
                      ✓ verified
                    </span>
                  )}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${categoryColor[skill.skill_category] || ""}`}>
                    {skill.skill_category}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-zinc-500 capitalize">{skill.proficiency_level}</span>
                  <div className="flex-1 max-w-[100px]">
                    <Progress value={skill.proof_score} className="h-1" />
                  </div>
                  <span className="text-[10px] text-zinc-600">
                    {skill.proof_score.toFixed(0)}% proof
                  </span>
                  {skill.endorsement_count > 0 && (
                    <span className="text-[10px] text-cyan-500">
                      {skill.endorsement_count} endorsements
                    </span>
                  )}
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemoveSkill(skill.id)}
                className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm"
              >
                ✕
              </button>
            </div>
          ))}

          {skills.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No skills added yet. Search above to start building your skill graph.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

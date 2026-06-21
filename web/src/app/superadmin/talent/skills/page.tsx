"use client";

import { useState, useEffect } from "react";
import { fetchWrapper } from "@/lib/fetch";
import { Network, Search, Plus, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function TalentSkillsManager() {
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      searchTaxonomy(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadProfile = async () => {
    const res = await fetchWrapper(`/talent/profile`);
    if (res.success) setProfile(res.data);
  };

  const searchTaxonomy = async (q: string) => {
    try {
      const res = await fetchWrapper(`/talent/skills/taxonomy?query=${q}`);
      if (res.success) setSuggestions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSkill = (skill: any) => {
    toast.success(`Added ${skill.name} to your skills graph`);
    // Optimistic UI update
    setProfile({
      ...profile,
      skills: [...profile.skills, { id: skill.id, name: skill.name, proficiency: "intermediate" }]
    });
    setSearchQuery("");
    setSuggestions([]);
  };

  if (!profile) return <div className="p-8">Loading Skills Graph...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 h-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skills Graph</h1>
        <p className="text-muted-foreground mt-1">Manage your normalized skills. These power AI matching across the ATS and Talent CRM.</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Network className="w-5 h-5" /> Add Skills</CardTitle>
              <CardDescription>Search the global skill taxonomy.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search for a skill (e.g. React, Python, Product Management)..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute top-12 left-0 w-full bg-white border rounded-md shadow-lg z-10 p-2 space-y-1">
                    {suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        className="w-full text-left px-3 py-2 hover:bg-muted rounded-sm flex items-center justify-between group"
                        onClick={() => handleAddSkill(s)}
                      >
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.category}</p>
                        </div>
                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Verified Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.skills.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">You haven't added any skills yet.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((s: any, i: number) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2">
                      {s.name}
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card className="bg-indigo-50 border-indigo-100">
            <CardHeader>
              <CardTitle className="text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> AI Skill Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-indigo-800 leading-relaxed mb-4">
                Let AI automatically extract your skills from your Resume or LinkedIn PDF and map them to the global taxonomy.
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Auto-Extract Skills</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

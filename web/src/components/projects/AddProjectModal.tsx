"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { userApi } from "@/lib/api/user-api";
import { X, Search, Loader2, Code2, PlusCircle } from "lucide-react";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "",
    github_url: "",
    live_url: "",
    stack: [] as string[],
    skill_ids: [] as string[],
  });

  // Skill Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await userApi.skillGraph.searchTaxonomy(q);
      setSearchResults(res || []);
    } catch (error) {
      console.error("Skill search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const addSkill = (skill: any) => {
    if (!selectedSkills.find(s => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
      setFormData(prev => ({ 
        ...prev, 
        skill_ids: [...prev.skill_ids, skill.id],
        stack: [...prev.stack, skill.name]
      }));
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeSkill = (id: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== id));
    setFormData(prev => ({
      ...prev,
      skill_ids: prev.skill_ids.filter(sid => sid !== id),
      stack: prev.stack.filter((_, i) => selectedSkills[i].id !== id)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Create Project
      const projectRes = await userApi.projects.create({
        title: formData.title,
        description: formData.description,
        role: formData.role,
        github_url: formData.github_url,
        live_url: formData.live_url,
        stack: formData.stack,
        start_date: new Date().toISOString(), // Mocking start date for MVP
      });

      // 2. Link Skills
      if (formData.skill_ids.length > 0) {
        await userApi.projects.linkSkills(projectRes.id, {
          skill_ids: formData.skill_ids,
          usage_context: `Used in ${formData.title} as ${formData.role}`,
          contribution_weight: 1.0
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-2xl border-primary/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            Add Proof-of-Work Project
          </DialogTitle>
          <DialogDescription>
            Document your expertise by linking skills to real-world projects.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. DeFi Lending Protocol"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-primary/5 border-primary/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  placeholder="e.g. Lead Smart Contract Developer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="bg-primary/5 border-primary/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your contributions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px] bg-primary/5 border-primary/10"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Map to Skills</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search skills (React, Python, Solidity...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-primary/5 border-primary/10"
                  />
                  {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />}
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-background border border-primary/20 rounded-md shadow-lg overflow-hidden max-h-[200px] overflow-y-auto">
                    {searchResults.map((skill) => (
                      <button
                        key={skill.id}
                        className="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors flex justify-between items-center"
                        onClick={() => addSkill(skill)}
                      >
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline" className="text-[10px]">{skill.category}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill.id} className="flex items-center gap-1 py-1 pl-3 pr-1 bg-primary text-primary-foreground">
                    {skill.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent hover:text-red-200"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedSkills.length === 0 && <p className="text-sm text-muted-foreground italic">No skills linked yet.</p>}
              </div>

              <div className="space-y-2 pt-4">
                <Label>Verifiable Evidence (URLs)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="GitHub Repo URL"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="bg-primary/5 border-primary/10"
                  />
                  <Input
                    placeholder="Live Demo URL"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    className="bg-primary/5 border-primary/10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step === 2 && (
            <Button variant="ghost" onClick={() => setStep(1)} disabled={loading}>
              Back
            </Button>
          )}
          <Button
            className="w-full sm:w-auto min-w-[100px]"
            onClick={step === 1 ? () => setStep(2) : handleSubmit}
            disabled={loading || (step === 1 && !formData.title)}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : step === 1 ? "Next Step" : "Save Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

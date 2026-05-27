"use client";

import React from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HybridSearchParams } from "@/lib/api/search-api";

interface SearchFacetsProps {
  filters: HybridSearchParams;
  setFilters: (filters: HybridSearchParams) => void;
}

export function SearchFacets({ filters, setFilters }: SearchFacetsProps) {
  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sort_by: value as any });
  };

  const handleRemoteChange = (checked: boolean) => {
    setFilters({ ...filters, remote_only: checked });
  };

  const handleSalaryChange = (value: number[]) => {
    setFilters({ ...filters, min_salary: value[0] });
  };

  return (
    <div className="flex flex-col gap-8 rounded-xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold tracking-tight">Filters</h3>
      </div>

      {/* Sort Options */}
      <div className="flex flex-col gap-3">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-3 w-3" />
          Sort & Rank
        </Label>
        <Select value={filters.sort_by || "hybrid"} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full bg-black/50 border-white/10 h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hybrid">✨ AI Hybrid Match</SelectItem>
            <SelectItem value="relevance">Highest Relevance</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="salary">Highest Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Preferences */}
      <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Work Preferences
        </Label>
        <div className="flex items-center space-x-3">
          <Checkbox 
            id="remote" 
            checked={filters.remote_only || false}
            onCheckedChange={handleRemoteChange}
            className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label htmlFor="remote" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Remote Only
          </Label>
        </div>
      </div>

      {/* Salary Expectation */}
      <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Minimum Salary
          </Label>
          <span className="text-xs font-bold text-green-500">
            ${((filters.min_salary || 0) / 1000).toFixed(0)}k+
          </span>
        </div>
        <Slider
          defaultValue={[filters.min_salary || 0]}
          max={300000}
          step={10000}
          onValueChange={handleSalaryChange}
          className="my-2"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>$0</span>
          <span>$150k</span>
          <span>$300k+</span>
        </div>
      </div>

      {/* Skills (Simplified for now) */}
      <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Quick Skills
        </Label>
        <div className="flex flex-wrap gap-2">
          {["React", "Python", "Node.js", "AI/ML", "Design"].map((skill) => {
            const isSelected = filters.required_skills?.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => {
                  const skills = filters.required_skills || [];
                  setFilters({
                    ...filters,
                    required_skills: isSelected 
                      ? skills.filter(s => s !== skill)
                      : [...skills, skill]
                  });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.3)]" 
                    : "bg-white/5 hover:bg-white/10 text-muted-foreground"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

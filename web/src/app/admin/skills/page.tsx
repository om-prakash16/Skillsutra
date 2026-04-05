"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, GitMerge, Plus, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function SkillsTaxonomy() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/skills`);
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill) return;
    try {
      await fetch(`${API_BASE}/admin/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: newSkill })
      });
      setNewSkill("");
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black font-heading tracking-tight flex items-center gap-3">
          <GitMerge className="w-8 h-8 text-primary" /> Skills Taxonomy Array
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage the hierarchical structure of acceptable platform skills and verifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
            <CardDescription>Expand the global skill tree.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Input 
              placeholder="e.g. Data Engineering" 
              className="bg-transparent border-white/10"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
            />
            <Button onClick={handleAddSkill} className="w-full bg-primary hover:bg-primary/90 font-bold">
              <Plus className="w-4 h-4 mr-2" /> Add Skill Class
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md md:col-span-2">
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><Tags className="w-5 h-5 text-primary"/> Active Taxonomy</CardTitle>
           </CardHeader>
           <CardContent>
             {isLoading ? (
               <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
             ) : (
               <div className="flex flex-wrap gap-3">
                 {skills.map(skill => (
                   <Badge key={skill.id} className="text-sm py-1.5 px-3 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                     {skill.category_name}
                   </Badge>
                 ))}
                 {skills.length === 0 && <p className="text-sm text-muted-foreground">No roots found. Start building the tree.</p>}
               </div>
             )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

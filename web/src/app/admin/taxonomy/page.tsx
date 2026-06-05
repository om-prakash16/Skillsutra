"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tags, Code, Building2, Plus, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { api } from "@/lib/api/api-client";

export default function AdminTaxonomyDashboard() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const skillsRes = await api.get('/admin/skills');
        setSkills(skillsRes || []);
      } catch (err) {
        console.error("Failed to fetch taxonomy", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxonomy();
  }, []);

  const taxonomyGroups = [
    {
      title: "Skills Directory",
      description: "Manage technical and soft skills for AI matching.",
      icon: Code,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      count: skills.length > 0 ? skills.length : 420,
      tags: skills.length > 0 ? skills.slice(0, 5).map(s => s.name) : ["React", "Python", "System Design", "Leadership", "AWS"]
    },
    {
      title: "Industries",
      description: "Sectors and verticals for company categorization.",
      icon: Building2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      count: 45,
      tags: ["FinTech", "HealthTech", "E-commerce", "SaaS", "Web3"]
    },
    {
      title: "Job Categories",
      description: "Roles and functional areas for ATS parsing.",
      icon: Tags,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      count: 120,
      tags: ["Frontend", "Backend", "Product Manager", "DevOps", "Design"]
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
        <div className="space-y-2">
          <Badge variant="outline" className="glass text-[10px] tracking-widest uppercase font-black mb-2 text-blue-400 border-blue-400/30">
            Metadata Architecture
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
            Taxonomy Manager
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Control the core vocabularies used by the AI matching engine and ATS parsers.
          </p>
        </div>
        <div className="flex gap-4">
          <Button size="lg" className="rounded-xl font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Plus className="w-5 h-5 mr-2" /> Add Vocabulary
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {taxonomyGroups.map((group, idx) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass h-full border-border/50 hover:border-border transition-all duration-300 rounded-[2rem] shadow-xl overflow-hidden group/card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${group.bg}`}>
                            <group.icon className={`w-6 h-6 ${group.color}`} />
                        </div>
                        <CardTitle className="text-xl font-black">{group.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs font-black">{group.count}</Badge>
                </div>
                <CardDescription className="text-sm font-medium">{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3">Popular Terms</p>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="bg-background/50 text-foreground/80 hover:bg-muted/50 cursor-pointer rounded-lg border-border/60">
                        {tag}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-dashed cursor-pointer rounded-lg">
                      +{group.count - 5} more
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <Button className="w-full rounded-xl bg-background border border-border hover:bg-muted font-bold text-foreground">
                    Manage Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

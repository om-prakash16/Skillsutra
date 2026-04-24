"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Code2, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  start_date: string;
  end_date?: string;
  github_url?: string;
  live_url?: string;
  stack: string[];
  is_ai_verified: boolean;
  integrity_score: number;
}

interface ProjectLedgerListProps {
  projects: Project[];
  onDelete?: (id: string) => void;
  onEdit?: (project: Project) => void;
  onRefresh?: () => void;
}

export const ProjectLedgerList: React.FC<ProjectLedgerListProps> = ({ projects, onDelete, onEdit, onRefresh }) => {
  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Code2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">No Projects Found</h3>
            <p className="text-muted-foreground max-w-xs">
              Start building your proof-of-work by adding your latest projects or syncing with GitHub.
            </p>
          </CardContent>
        </Card>
      ) : (
        projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-primary/10 bg-background/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="text-primary font-medium">{project.role}</span>
                      <span className="text-muted-foreground">•</span>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(project.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        {project.end_date ? ` — ${new Date(project.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}` : ' — Present'}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-primary hover:text-primary-foreground">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.live_url && (
                      <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-primary hover:text-primary-foreground">
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Proof Status</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${project.is_ai_verified ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`} />
                        <span className="text-xs font-semibold">{project.is_ai_verified ? 'Verified Evidence' : 'Pending Verification'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Integrity Score</span>
                      <span className="text-xs font-bold text-primary">{project.integrity_score}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => onEdit?.(project)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete?.(project.id)}>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
};

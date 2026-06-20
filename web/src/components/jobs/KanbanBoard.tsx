"use client";

import React, { useState } from "react";
import { User, GripVertical, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
}

interface Stage {
  id: string;
  title: string;
  candidates: Candidate[];
}

export function KanbanBoard() {
  const [stages, setStages] = useState<Stage[]>([
    {
      id: "applied",
      title: "New Applicants",
      candidates: [
        { id: "c1", name: "Alice Johnson", role: "Frontend Engineer", score: 85 },
        { id: "c2", name: "Bob Smith", role: "Frontend Engineer", score: 72 },
      ]
    },
    {
      id: "screening",
      title: "AI Screening",
      candidates: [
        { id: "c3", name: "Charlie Davis", role: "Frontend Engineer", score: 91 },
      ]
    },
    {
      id: "interview",
      title: "Technical Interview",
      candidates: [
        { id: "c4", name: "Diana Prince", role: "Frontend Engineer", score: 98 },
      ]
    },
    {
      id: "offer",
      title: "Offer Stage",
      candidates: []
    }
  ]);

  // Very simple drag and drop simulation without full HTML5 DnD boilerplate for demo purposes
  const moveCandidate = (candidateId: string, toStageId: string) => {
    setStages(prev => {
      let movedCandidate: Candidate | null = null;
      
      // Remove from old stage
      const tempStages = prev.map(stage => {
        const candidate = stage.candidates.find(c => c.id === candidateId);
        if (candidate) movedCandidate = candidate;
        return {
          ...stage,
          candidates: stage.candidates.filter(c => c.id !== candidateId)
        };
      });

      // Add to new stage
      if (movedCandidate) {
        return tempStages.map(stage => {
          if (stage.id === toStageId) {
            return {
              ...stage,
              candidates: [...stage.candidates, movedCandidate!]
            };
          }
          return stage;
        });
      }
      return prev;
    });
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-[600px]">
      {stages.map(stage => (
        <div key={stage.id} className="min-w-[300px] w-[300px] flex flex-col bg-muted/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{stage.title}</h3>
            <Badge variant="secondary">{stage.candidates.length}</Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3">
            {stage.candidates.map(candidate => (
              <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{candidate.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{candidate.role}</span>
                    <Badge variant={candidate.score > 90 ? "default" : "outline"} className="ml-auto">
                      {candidate.score}% Match
                    </Badge>
                  </div>
                  
                  {/* Mock action buttons to move stages */}
                  <div className="flex justify-between pt-2 mt-2 border-t border-muted">
                    {stage.id !== "applied" && (
                      <button onClick={() => moveCandidate(candidate.id, "applied")} className="text-xs text-blue-500 hover:underline">← Back</button>
                    )}
                    {stage.id !== "offer" && (
                      <button onClick={() => moveCandidate(candidate.id, "offer")} className="text-xs text-green-500 hover:underline ml-auto">Advance →</button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

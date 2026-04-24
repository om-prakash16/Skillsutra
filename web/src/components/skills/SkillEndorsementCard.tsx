"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Endorsement {
  id: string;
  endorser_name?: string;
  endorser_relationship: string;
  comment?: string;
  weight: number;
  created_at: string;
}

export default function SkillEndorsementCard({
  skillName,
  endorsements,
  endorsementCount,
  onEndorse,
  canEndorse = false,
}: {
  skillName: string;
  endorsements: Endorsement[];
  endorsementCount: number;
  onEndorse?: () => void;
  canEndorse?: boolean;
}) {
  return (
    <Card className="border-white/5 bg-zinc-950/50 backdrop-blur-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{skillName}</span>
            <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-500/20">
              {endorsementCount} endorsement{endorsementCount !== 1 ? "s" : ""}
            </Badge>
          </div>
          {canEndorse && (
            <Button variant="outline" size="sm" onClick={onEndorse} className="text-xs h-7">
              + Endorse
            </Button>
          )}
        </div>

        {endorsements.length > 0 && (
          <div className="space-y-2">
            {endorsements.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/30 border border-white/5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {(e.endorser_name || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{e.endorser_name || "Anonymous"}</span>
                    <span className="text-[10px] text-zinc-600">{e.endorser_relationship}</span>
                  </div>
                  {e.comment && <p className="text-[11px] text-zinc-500 mt-0.5">{e.comment}</p>}
                </div>
              </div>
            ))}
            {endorsementCount > 5 && (
              <p className="text-[11px] text-zinc-600 text-center">
                + {endorsementCount - 5} more endorsements
              </p>
            )}
          </div>
        )}

        {endorsements.length === 0 && (
          <p className="text-xs text-zinc-600 text-center py-2">No endorsements yet</p>
        )}
      </CardContent>
    </Card>
  );
}

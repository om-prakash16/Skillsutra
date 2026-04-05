"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, RefreshCcw, ShieldCheck, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SyncStatusBadgeProps {
    status?: "pending" | "synced" | "failed" | "outdated";
    lastSynced?: string;
    onRetry?: () => void;
}

export function SyncStatusBadge({ status, lastSynced, onRetry }: SyncStatusBadgeProps) {
  if (!status) return null;

  const config = {
    synced: {
        label: "SYNCED",
        color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        icon: <ShieldCheck className="w-3 h-3" />,
        description: `Last synced to Solana on ${lastSynced ? new Date(lastSynced).toLocaleDateString() : 'N/A'}`
    },
    pending: {
        label: "PENDING CHANGES",
        color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        icon: <Clock className="w-3 h-3 animate-pulse" />,
        description: "Your SaaS data has been updated. Sync to Solana to finalize proof."
    },
    failed: {
        label: "SYNC FAILED",
        color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        icon: <AlertCircle className="w-3 h-3" />,
        description: "The last blockchain transaction failed. Click to retry."
    },
    outdated: {
        label: "OUTDATED",
        color: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
        icon: <RefreshCcw className="w-3 h-3" />,
        description: "Verification state is older than current profile data."
    }
  };

  const current = config[status] || config.pending;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-2 px-3 py-1 text-[10px] font-black italic tracking-tighter uppercase cursor-help transition-all ${current.color}`}
            onClick={status === 'failed' ? onRetry : undefined}
          >
            {current.icon}
            {current.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-black/90 border-white/10 text-[10px] font-bold italic p-3">
          {current.description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

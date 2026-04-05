"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";

interface StatusIndicatorProps {
  status: "pending" | "confirmed" | "failed" | "finalized";
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse",
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    finalized: {
      label: "Finalized",
      icon: ShieldCheck,
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium w-fit",
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}

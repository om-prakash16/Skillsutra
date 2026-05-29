"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  User, 
  Building2, 
  MapPin, 
  DollarSign, 
  Star,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { HoverCard } from "@/components/motion/HoverCard";

export interface SearchResult {
  id: string;
  type: "job" | "profile" | "company";
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  tags?: string[];
  salary?: string;
  matchScore?: number;
  url: string;
}

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
}

export function SearchResultCard({ result, index }: SearchResultCardProps) {
  // Determine icon and color based on entity type
  const getTypeConfig = () => {
    switch (result.type) {
      case "job":
        return { icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", glow: "rgba(59, 130, 246, 0.15)" };
      case "profile":
        return { icon: User, color: "text-green-500", bg: "bg-green-500/10", glow: "rgba(34, 197, 94, 0.15)" };
      case "company":
        return { icon: Building2, color: "text-purple-500", bg: "bg-purple-500/10", glow: "rgba(168, 85, 247, 0.15)" };
    }
  };

  const { icon: Icon, color, bg, glow } = getTypeConfig();

  return (
    <HoverCard
      glowColor={glow}
      className="group flex flex-col gap-4 p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bg}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div>
            <Link href={result.url} className="text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors flex items-center gap-2">
              {result.title}
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            {result.subtitle && (
              <p className="text-sm font-medium text-muted-foreground">{result.subtitle}</p>
            )}
          </div>
        </div>

        {/* AI Match Score Badge */}
        {result.matchScore && (
          <Badge variant="default" className="flex items-center gap-1 bg-primary/20 text-primary border-primary/30">
            <Star className="h-3 w-3 fill-primary" />
            {Math.round(result.matchScore * 100)}% Match
          </Badge>
        )}
      </div>

      {result.description && (
        <p className="text-sm text-muted-foreground/80 line-clamp-2">
          {result.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-y-2 gap-x-4 pt-2">
        {result.location && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {result.location}
          </div>
        )}
        
        {result.salary && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-500/80">
            <DollarSign className="h-3.5 w-3.5" />
            {result.salary}
          </div>
        )}
        
        <div className="flex flex-wrap gap-1.5 ml-auto">
          {result.tags?.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] uppercase tracking-wider bg-muted/50 hover:bg-muted/50">
              {tag}
            </Badge>
          ))}
          {result.tags && result.tags.length > 3 && (
            <Badge variant="outline" className="text-[10px] border-border">
              +{result.tags.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </HoverCard>
  );
}

"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Zap, Clock, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";

interface SortDropdownProps {
    onSortChange: (sort: string) => void;
    type: 'candidates' | 'jobs';
}

export function SortDropdown({ onSortChange, type }: SortDropdownProps) {
    const [selected, setSelected] = useState(type === 'candidates' ? 'Proof Score' : 'AI Match Score');

    const options = type === 'candidates' 
        ? [
            { label: 'Highest Proof Score', value: 'proof_score', icon: Zap },
            { label: 'Most Experienced', value: 'experience', icon: Clock },
            { label: 'Skill Relevance', value: 'relevance', icon: TrendingUp }
        ]
        : [
            { label: 'AI Match Score', value: 'match_score', icon: Zap },
            { label: 'Highest Salary', value: 'salary', icon: DollarSign },
            { label: 'Newest Posted', value: 'date', icon: Clock }
        ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-16 px-8 glass border-white/10 hover:border-primary/50 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 rounded-2xl transition-all group">
                    <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">SORT BY:</span> 
                    <span className="text-foreground">{selected}</span> 
                    <ChevronDown className="w-4 h-4 ml-2 text-primary" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-white/10 min-w-[240px] p-2 rounded-2xl shadow-2xl">
                {options.map(opt => (
                    <DropdownMenuItem 
                        key={opt.value} 
                        onClick={() => { setSelected(opt.label); onSortChange(opt.value); }}
                        className="p-4 font-black text-[10px] uppercase tracking-[0.1em] focus:bg-primary/20 focus:text-primary cursor-pointer flex items-center gap-4 rounded-xl transition-all"
                    >
                        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                            <opt.icon className="w-4 h-4 text-primary" />
                        </div>
                        {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

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
                <Button variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                    SORT BY: <span className="text-primary">{selected}</span> <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-white/10 backdrop-blur-xl">
                {options.map(opt => (
                    <DropdownMenuItem 
                        key={opt.value} 
                        onClick={() => { setSelected(opt.label); onSortChange(opt.value); }}
                        className="p-3 font-bold text-xs uppercase tracking-widest focus:bg-primary focus:text-black cursor-pointer flex items-center gap-3"
                    >
                        <opt.icon className="w-4 h-4 font-bold" /> {opt.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Filter, Zap, DollarSign, MapPin } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
    onFilterChange: (filters: any) => void;
    type: 'candidates' | 'jobs';
}

export function FilterSidebar({ onFilterChange, type }: FilterSidebarProps) {
  const [minScore, setMinScore] = useState([0]);

  return (
    <div className="w-full space-y-10">
      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="skills" className="border-white/5">
          <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary hover:no-underline transition-all py-6">
            TECHNICAL STACK
          </AccordionTrigger>
          <AccordionContent className="space-y-5 pt-2">
            {['FastAPI', 'React', 'Solana', 'Rust', 'Next.js'].map(skill => (
              <div key={skill} className="flex items-center space-x-4 group">
                <Checkbox id={skill} className="border-white/10 w-5 h-5 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <Label htmlFor={skill} className="text-sm font-black text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors uppercase tracking-tight">
                  {skill}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {type === 'candidates' && (
          <AccordionItem value="scores" className="border-white/5">
            <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary hover:no-underline transition-all py-6">
              MIN PROOF SCORE
            </AccordionTrigger>
            <AccordionContent className="space-y-8 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-black italic text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">{minScore[0]}</span>
                <Zap className="w-5 h-5 fill-primary text-primary animate-pulse" />
              </div>
              <Slider 
                defaultValue={[0]} 
                max={100} 
                step={5} 
                onValueChange={(val) => setMinScore(val)}
                className="[&_.relative_div]:bg-primary"
              />
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/40 leading-relaxed">Filtering for verified high-signal talent with verified credentials.</p>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="location" className="border-white/5">
          <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary hover:no-underline transition-all py-6">
            <MapPin className="w-3.5 h-3.5 mr-2" /> LOCATION
          </AccordionTrigger>
          <AccordionContent className="space-y-5 pt-2">
            {['Remote', 'Dubai', 'Singapore', 'London', 'New York'].map(loc => (
              <div key={loc} className="flex items-center space-x-4 group">
                <Checkbox id={loc} className="border-white/10 w-5 h-5 rounded-md" />
                <Label htmlFor={loc} className="text-sm font-black text-muted-foreground group-hover:text-foreground cursor-pointer uppercase tracking-tight">
                  {loc}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

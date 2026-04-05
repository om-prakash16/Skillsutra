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
    <div className="w-full space-y-8 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-3xl h-fit sticky top-24">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-black italic tracking-tighter uppercase">Discovery Filters</h3>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="skills" className="border-white/10">
          <AccordionTrigger className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:no-underline">
            TECHNICAL STACK
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            {['FastAPI', 'React', 'Solana', 'Rust', 'Next.js'].map(skill => (
              <div key={skill} className="flex items-center space-x-3 group">
                <Checkbox id={skill} className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <Label htmlFor={skill} className="text-sm font-bold text-neutral-300 group-hover:text-white cursor-pointer transition-colors uppercase italic tracking-tighter">
                  {skill}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {type === 'candidates' && (
          <AccordionItem value="scores" className="border-white/10">
            <AccordionTrigger className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:no-underline">
              MIN PROOF SCORE
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black italic text-primary">{minScore[0]}</span>
                <Zap className="w-4 h-4 fill-primary text-primary animate-pulse" />
              </div>
              <Slider 
                defaultValue={[0]} 
                max={100} 
                step={5} 
                onValueChange={(val) => setMinScore(val)}
                className="[&_.relative_div]:bg-primary"
              />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="location" className="border-white/10">
          <AccordionTrigger className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:no-underline">
            <MapPin className="w-3 h-3 mr-1" /> LOCATION
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            {['Remote', 'Dubai', 'Singapore', 'London', 'New York'].map(loc => (
              <div key={loc} className="flex items-center space-x-3 group">
                <Checkbox id={loc} className="border-white/20" />
                <Label htmlFor={loc} className="text-sm font-bold text-neutral-300 group-hover:text-white cursor-pointer uppercase italic tracking-tighter">
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

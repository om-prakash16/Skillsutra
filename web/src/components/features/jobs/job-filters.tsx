'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Filters {
  type: string[];
  workMode: string[];
  experience: string[];
  salary: string[];
  postedDate: string[];
}

interface JobFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export function JobFilters({ filters, setFilters }: JobFiltersProps) {
  const toggleFilter = (category: keyof Filters, value: string) => {
    const current = [...filters[category]];
    const index = current.indexOf(value);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(value);
    }
    
    setFilters({ ...filters, [category]: current });
  };

  const clearAll = () => {
    setFilters({
      type: [],
      workMode: [],
      experience: [],
      salary: [],
      postedDate: []
    });
  };

  const FILTER_SECTIONS = [
    {
      id: 'type',
      label: 'Job Type',
      options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
    },
    {
      id: 'workMode',
      label: 'Work Mode',
      options: ['On-site', 'Hybrid', 'Remote']
    },
    {
      id: 'experience',
      label: 'Experience Level',
      options: ['Fresher', 'Junior (1-2y)', 'Mid-level (3-5y)', 'Senior (5-8y)', 'Lead (8+y)']
    },
    {
      id: 'salary',
      label: 'Salary (LPA)',
      options: ['0-3 LPA', '3-6 LPA', '6-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA']
    },
    {
      id: 'postedDate',
      label: 'Date Posted',
      options: ['Last 24 hours', 'Last 3 days', 'Last 7 days', 'Last 30 days']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAll}
          className="text-primary hover:text-primary/80 h-8 px-2 font-medium"
        >
          Clear All
        </Button>
      </div>
      
      <Separator className="bg-border/40" />

      <Accordion type="multiple" defaultValue={['type', 'workMode', 'experience']} className="w-full">
        {FILTER_SECTIONS.map((section) => (
          <AccordionItem key={section.id} value={section.id} className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-3 px-1 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              {section.label}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 px-1 space-y-3">
              {section.options.map((option) => (
                <div key={option} className="flex items-center space-x-3 group cursor-pointer">
                  <Checkbox 
                    id={`${section.id}-${option}`} 
                    checked={filters[section.id as keyof Filters].includes(option)}
                    onCheckedChange={() => toggleFilter(section.id as keyof Filters, option)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label 
                    htmlFor={`${section.id}-${option}`}
                    className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

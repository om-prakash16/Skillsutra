'use client';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { INDUSTRIES, SIZES } from '@/lib/mock-api/companies';

interface CompanyFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedIndustries: string[];
  setSelectedIndustries: (industries: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  onlyHiring: boolean;
  setOnlyHiring: (status: boolean) => void;
}

export function CompanyFilters({
  searchQuery,
  setSearchQuery,
  selectedIndustries,
  setSelectedIndustries,
  selectedSizes,
  setSelectedSizes,
  onlyHiring,
  setOnlyHiring
}: CompanyFiltersProps) {
  
  const toggleIndustry = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Company Name</Label>
        <Input 
          placeholder="Search corporate directory..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 bg-background/50 border-primary/10 transition-all focus:border-primary/50"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Industries</Label>
        <div className="space-y-3 px-1">
          {INDUSTRIES.map((industry) => (
            <div key={industry} className="flex items-center space-x-2.5 group cursor-pointer">
              <Checkbox 
                id={industry} 
                checked={selectedIndustries.includes(industry)}
                onCheckedChange={() => toggleIndustry(industry)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label 
                htmlFor={industry} 
                className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors"
              >
                {industry}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Company Size</Label>
        <div className="space-y-3 px-1">
          {SIZES.map((size) => (
            <div key={size} className="flex items-center space-x-2.5 group cursor-pointer">
              <Checkbox 
                id={size} 
                checked={selectedSizes.includes(size)}
                onCheckedChange={() => toggleSize(size)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label 
                htmlFor={size} 
                className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors"
              >
                {size} employees
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-primary/10">
        <div className="flex items-center justify-between">
          <Label htmlFor="hiring-toggle" className="text-sm font-bold">Actively Hiring Only</Label>
          <Switch 
            id="hiring-toggle" 
            checked={onlyHiring}
            onCheckedChange={setOnlyHiring}
          />
        </div>
      </div>
    </div>
  );
}

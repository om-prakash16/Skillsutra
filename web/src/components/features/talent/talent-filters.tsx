'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const ROLES = ['Frontend', 'Backend', 'Fullstack', 'Design', 'Mobile', 'Data', 'AI', 'Security'];
const LEVELS = ['Junior', 'Mid-level', 'Senior', 'Lead'];
const AVAILABILITY = ['Immediate', '2 Weeks', '1 Month'];

export function TalentFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const toggleParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(',') || [];
    const index = current.indexOf(value);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(value);
    }
    
    if (current.length > 0) params.set(key, current.join(','));
    else params.delete(key);
    
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isChecked = (key: string, value: string) => {
    return searchParams.get(key)?.split(',').includes(value) || false;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Discovery Filters</h3>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
           {searchParams.toString().split('&').filter(p => !p.includes('page') && p.includes('=')).length} Active
        </Badge>
      </div>

      <Separator className="bg-border/40" />

      <div className="space-y-6">
        {/* Roles Section */}
        <section className="space-y-4">
          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Expertise Field</Label>
          <div className="grid grid-cols-1 gap-3">
            {ROLES.map((role) => (
              <div key={role} className="flex items-center space-x-3 group cursor-pointer">
                <Checkbox 
                  id={`role-${role}`} 
                  checked={isChecked('role', role)} 
                  onCheckedChange={() => toggleParam('role', role)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor={`role-${role}`} className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors">
                  {role} Developer
                </Label>
              </div>
            ))}
          </div>
        </section>

        {/* Level Section */}
        <section className="space-y-4">
          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Experience Level</Label>
          <div className="grid grid-cols-1 gap-3">
            {LEVELS.map((level) => (
              <div key={level} className="flex items-center space-x-3 group cursor-pointer">
                <Checkbox 
                  id={`exp-${level}`} 
                  checked={isChecked('exp', level)} 
                  onCheckedChange={() => toggleParam('exp', level)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor={`exp-${level}`} className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors">
                  {level} Pros
                </Label>
              </div>
            ))}
          </div>
        </section>

        {/* Availability Section */}
        <section className="space-y-4">
          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Availability</Label>
          <div className="grid grid-cols-1 gap-3">
            {AVAILABILITY.map((val) => (
              <div key={val} className="flex items-center space-x-3 group cursor-pointer">
                <Checkbox 
                  id={`ava-${val}`} 
                  checked={isChecked('availability', val)} 
                  onCheckedChange={() => toggleParam('availability', val)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor={`ava-${val}`} className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors">
                  {val} Starts
                </Label>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

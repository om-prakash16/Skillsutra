'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export function SalaryFilters() {
  return (
    <div className="space-y-8 bg-card/20 backdrop-blur-xl border border-primary/10 p-6 rounded-xl">
      <div className="space-y-2">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Functional Role</Label>
        <Select defaultValue="frontend">
          <SelectTrigger className="h-11 bg-background/50 border-primary/10">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">Frontend Developer</SelectItem>
            <SelectItem value="backend">Backend Developer</SelectItem>
            <SelectItem value="data">Data Scientist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Global Location</Label>
        <Input placeholder="e.g. Bengaluru, Remote" className="h-11 bg-background/50 border-primary/10" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Experience Bracket</Label>
        <Select defaultValue="mid">
          <SelectTrigger className="h-11 bg-background/50 border-primary/10">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="junior">0-2 Years</SelectItem>
            <SelectItem value="mid">2-5 Years</SelectItem>
            <SelectItem value="senior">5+ Years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function SearchHeader({ onSearch }: { onSearch: (query: string, isSemantic: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [isSemantic, setIsSemantic] = useState(false);

  return (
    <div className="w-full bg-card/50 backdrop-blur-md border-b sticky top-0 z-30 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isSemantic ? "Describe who you're looking for... (e.g. Expert in Python/AWS)" : "Search by name, title, or keywords..."}
            className="pl-10 h-12 bg-background/50 border-primary/20 focus-visible:ring-primary/40 text-lg"
          />
        </div>
        
        <div className="flex items-center gap-6 px-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="semantic-mode" 
              checked={isSemantic}
              onCheckedChange={setIsSemantic}
            />
            <Label htmlFor="semantic-mode" className="flex items-center gap-1.5 cursor-pointer font-medium">
              <Sparkles className={`w-4 h-4 ${isSemantic ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
              Semantic Search
            </Label>
          </div>
          
          <Button 
            onClick={() => onSearch(query, isSemantic)}
            className="h-12 px-8 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 transition-all font-bold text-base"
          >
            Find Talent
          </Button>
        </div>
      </div>
    </div>
  );
}

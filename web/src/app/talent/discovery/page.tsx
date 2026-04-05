'use client';

import { SearchHeader } from '@/components/search/SearchHeader';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { CandidateCard } from '@/components/talent/CandidateCard'; // Placeholder/Mock
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TalentDiscoveryPage() {
  const [results, setResults] = useState([1, 2, 3, 4, 5]); // Mock result count

  const handleSearch = (query: string, isSemantic: boolean) => {
    console.log(`Searching for: ${query} (Semantic: ${isSemantic})`);
    // API call to v1/search/candidates
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Left: Filters */}
        <FilterSidebar />

        {/* Right: Results Dashboard */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Talent Discovery</h1>
              <p className="text-muted-foreground mt-1">Found {results.length} verified candidates matching your criteria.</p>
            </div>
            
            <Tabs defaultValue="all" className="w-[300px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Mocked results for now */}
            {results.map((r) => (
              <div key={r} className="p-6 border rounded-2xl bg-card/20 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                      OP
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Om Prakash</h3>
                      <p className="text-muted-foreground">Full Stack AI Developer • 5+ Years</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-bold">PYTHON</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-400 font-bold">FASTAPI</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-500 font-bold">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Proof Score</div>
                    <div className="text-2xl font-black text-primary">892</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useUniversalSearch } from "@/hooks/useSearch";
import { HybridSearchParams } from "@/lib/api/search-api";
import { SearchFacets } from "@/components/search/SearchFacets";
import { SearchResultCard, SearchResult } from "@/components/search/SearchResultCard";
import { StaggerList } from "@/components/motion/StaggerList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);
  const [activeTab, setActiveTab] = useState("all");
  
  const [filters, setFilters] = useState<HybridSearchParams>({
    sort_by: "hybrid",
    limit: 20
  });

  // Combine query and filters
  const searchConfig = {
    ...filters,
    q: debouncedQuery,
    // Add entity filter based on tab if needed, but universalSearch usually returns all
  };

  const { data, isLoading } = useUniversalSearch(searchConfig);

  // Transform backend response into unified SearchResult array
  const results: SearchResult[] = React.useMemo(() => {
    if (!data) return [];
    
    let all: SearchResult[] = [];
    
    if (data.jobs && (activeTab === "all" || activeTab === "jobs")) {
      const mapped = data.jobs.map((j: any) => ({
        id: j.id,
        type: "job" as const,
        title: j.title,
        subtitle: j.company_name,
        description: j.description_markdown?.substring(0, 150) + "...",
        location: "Remote/Global", // Placeholder if missing
        salary: j.budget_range?.min ? `$${j.budget_range.min / 1000}k+` : undefined,
        matchScore: j.score,
        url: `/jobs/${j.id}`
      }));
      all = [...all, ...mapped];
    }
    
    if (data.profiles && (activeTab === "all" || activeTab === "talent")) {
      const mapped = data.profiles.map((p: any) => ({
        id: p.user_id,
        type: "profile" as const,
        title: `${p.first_name || ""} ${p.last_name || ""}`.trim() || p.username,
        subtitle: p.title,
        description: p.bio,
        location: p.location,
        tags: p.skills,
        matchScore: p.score,
        url: `/u/${p.username}`
      }));
      all = [...all, ...mapped];
    }
    
    if (data.companies && (activeTab === "all" || activeTab === "companies")) {
      const mapped = data.companies.map((c: any) => ({
        id: c.id,
        type: "company" as const,
        title: c.name,
        subtitle: c.industry,
        description: "Company profile and open positions.",
        url: `/company/${c.id}`
      }));
      all = [...all, ...mapped];
    }
    
    // Sort combined results by score if available
    return all.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [data, activeTab]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background selection:bg-primary/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Hero Search Section */}
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4 text-gradient">
            Discover the Ecosystem
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            Find the perfect opportunity, top-tier talent, or your next strategic partner with AI-powered hybrid search.
          </p>
          
          <div className="w-full max-w-3xl relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-background/80 border border-border p-2 rounded-full backdrop-blur-xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary shadow-2xl transition-all">
              <Search className="h-6 w-6 text-muted-foreground ml-4" />
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, talent, companies, or specific skills..."
                className="border-0 bg-transparent h-12 text-lg focus-visible:ring-0 shadow-none px-4"
              />
              <Button className="rounded-full h-12 px-8 text-sm font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <SearchFacets filters={filters} setFilters={setFilters} />
            </div>
          </div>
          
          {/* Results Area */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Tabs & Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="bg-background/80 border border-border/50">
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  <TabsTrigger value="jobs">Jobs</TabsTrigger>
                  <TabsTrigger value="talent">Talent</TabsTrigger>
                  <TabsTrigger value="companies">Companies</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="text-sm font-medium text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Syncing...</span>
                ) : (
                  <span>Showing <strong className="text-foreground">{results.length}</strong> results</span>
                )}
              </div>
            </div>
            
            {/* Results Grid */}
            <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isLoading && results.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-black/20 rounded-2xl border border-border/50 border-dashed">
                  <div className="bg-muted/50 p-4 rounded-full mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No results found</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find any matches for your current search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => { setQuery(""); setFilters({ sort_by: "hybrid", limit: 20 }); }}>
                    Clear all filters
                  </Button>
                </div>
              )}
              
              {results.map((result, i) => (
                <SearchResultCard key={`${result.type}-${result.id}`} result={result} index={i} />
              ))}
            </StaggerList>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UniversalSearchPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen pt-24 pb-20 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <SearchContent />
    </React.Suspense>
  );
}

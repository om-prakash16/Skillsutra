"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  User, 
  Building2, 
  Code,
  Search,
  ArrowRight
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useAutocomplete } from "@/hooks/useSearch";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export function GlobalSearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  // Fetch autocomplete results from the backend
  const { data, isLoading } = useAutocomplete(debouncedQuery);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      runCommand(() => router.push(`/search?q=${encodeURIComponent(query)}`));
    }
  };

  return (
    <>
      {/* Search trigger button for UI placement if needed elsewhere */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-input bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full max-w-sm"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline-flex">Search jobs, talent, companies...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for anything..." 
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !data?.jobs?.length && !data?.profiles?.length) {
              handleSearchSubmit();
            }
          }}
        />
        <CommandList>
          {isLoading && <CommandEmpty>Searching the ecosystem...</CommandEmpty>}
          {!isLoading && query.length > 1 && !data?.jobs?.length && !data?.profiles?.length && !data?.companies?.length && (
            <CommandEmpty>
              No exact matches found. 
              <div className="mt-4">
                <button 
                  onClick={handleSearchSubmit}
                  className="text-primary hover:underline text-sm flex items-center justify-center mx-auto"
                >
                  Run Deep AI Search <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </CommandEmpty>
          )}

          {/* Quick Actions (Always visible or when query is empty) */}
          {!query && (
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => runCommand(() => router.push("/jobs"))}>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Explore Jobs</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/talent"))}>
                <User className="mr-2 h-4 w-4" />
                <span>Find Talent</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/companies"))}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Discover Companies</span>
              </CommandItem>
            </CommandGroup>
          )}

          {/* Jobs Results */}
          {data?.jobs && data.jobs.length > 0 && (
            <>
              <CommandGroup heading="Jobs">
                {data.jobs.map((job: any) => (
                  <CommandItem
                    key={job.id}
                    value={`job-${job.id}-${job.title}`}
                    onSelect={() => runCommand(() => router.push(`/jobs/${job.id}`))}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
                      <span>{job.title}</span>
                    </div>
                    {job.company_name && (
                      <span className="text-xs text-muted-foreground">{job.company_name}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Talent Results */}
          {data?.profiles && data.profiles.length > 0 && (
            <>
              <CommandGroup heading="Talent">
                {data.profiles.map((profile: any) => (
                  <CommandItem
                    key={profile.user_id}
                    value={`talent-${profile.user_id}-${profile.first_name}`}
                    onSelect={() => runCommand(() => router.push(`/u/${profile.username}`))}
                  >
                    <User className="mr-2 h-4 w-4 text-green-500" />
                    <span>{profile.first_name} {profile.last_name}</span>
                    {profile.title && (
                      <span className="ml-2 text-xs text-muted-foreground">- {profile.title}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Company Results */}
          {data?.companies && data.companies.length > 0 && (
            <>
              <CommandGroup heading="Companies">
                {data.companies.map((company: any) => (
                  <CommandItem
                    key={company.id}
                    value={`company-${company.id}-${company.name}`}
                    onSelect={() => runCommand(() => router.push(`/company/${company.id}`))}
                  >
                    <Building2 className="mr-2 h-4 w-4 text-purple-500" />
                    <span>{company.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Deep Search Option */}
          {query && (
            <CommandGroup>
              <CommandItem onSelect={handleSearchSubmit}>
                <Search className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium text-primary">View all results for "{query}"</span>
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

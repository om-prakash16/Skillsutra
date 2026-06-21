"use client";

import { useState, useEffect, useCallback } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Search, User, Building2, Briefcase, FileText, Settings, ShieldAlert, Cpu } from "lucide-react";
import { api } from "@/lib/api/api-client";
import { toast } from "sonner";

export function GlobalSearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ users: any[], companies: any[], jobs: any[] }>({
    users: [],
    companies: [],
    jobs: []
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    if (!query) {
      setResults({ users: [], companies: [], jobs: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        // Assume API has a global search endpoint
        // const searchRes = await api.get(`/admin/search?q=${query}`);
        // Mocking for now as requested
        setResults({
            users: [{ id: "1", name: `Candidate ${query}`, type: "user" }],
            companies: [{ id: "2", name: `${query} Corp`, type: "company" }],
            jobs: [{ id: "3", name: `Senior ${query} Engineer`, type: "job" }]
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const onSelect = (route: string) => {
    setOpen(false);
    router.push(route);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={query} 
        onValueChange={setQuery} 
      />
      <CommandList>
        <CommandEmpty>{loading ? "Searching..." : "No results found."}</CommandEmpty>
        
        {results.users.length > 0 && (
          <CommandGroup heading="Users">
            {results.users.map((user, idx) => (
              <CommandItem key={idx} onSelect={() => onSelect(`/superadmin/users?search=${user.name}`)}>
                <User className="mr-2 h-4 w-4" />
                <span>{user.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.companies.length > 0 && (
          <CommandGroup heading="Companies">
            {results.companies.map((company, idx) => (
              <CommandItem key={idx} onSelect={() => onSelect(`/superadmin/companies?search=${company.name}`)}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>{company.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.jobs.length > 0 && (
          <CommandGroup heading="Jobs">
            {results.jobs.map((job, idx) => (
              <CommandItem key={idx} onSelect={() => onSelect(`/superadmin/jobs?search=${job.name}`)}>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>{job.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />
        <CommandGroup heading="Quick Links">
          <CommandItem onSelect={() => onSelect("/superadmin/security")}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            <span>Security Center</span>
          </CommandItem>
          <CommandItem onSelect={() => onSelect("/superadmin/ai-config")}>
            <Cpu className="mr-2 h-4 w-4" />
            <span>AI Resonance Config</span>
          </CommandItem>
          <CommandItem onSelect={() => onSelect("/superadmin/cms/pages")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>CMS Pages</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

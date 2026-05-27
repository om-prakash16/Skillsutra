import { useQuery } from "@tanstack/react-query";
import { searchApi, HybridSearchParams, SearchParams } from "@/lib/api/search-api";

export const SEARCH_KEYS = {
  all: ["search"] as const,
  autocomplete: (query: string) => [...SEARCH_KEYS.all, "autocomplete", query] as const,
  jobs: (params: HybridSearchParams) => [...SEARCH_KEYS.all, "jobs", params] as const,
  talent: (params: HybridSearchParams) => [...SEARCH_KEYS.all, "talent", params] as const,
  universal: (params: SearchParams) => [...SEARCH_KEYS.all, "universal", params] as const,
};

export function useAutocomplete(query: string, limit = 5) {
  return useQuery({
    queryKey: SEARCH_KEYS.autocomplete(query),
    queryFn: () => searchApi.autocomplete(query, limit),
    enabled: query.length > 1, // Only search if query is at least 2 chars
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useSearchJobs(params: HybridSearchParams) {
  return useQuery({
    queryKey: SEARCH_KEYS.jobs(params),
    queryFn: () => searchApi.searchJobs(params),
    enabled: true, // Always run, even with empty query (will just return recent/relevant)
  });
}

export function useSearchTalent(params: HybridSearchParams) {
  return useQuery({
    queryKey: SEARCH_KEYS.talent(params),
    queryFn: () => searchApi.searchTalent(params),
    enabled: true,
  });
}

export function useUniversalSearch(params: SearchParams) {
  return useQuery({
    queryKey: SEARCH_KEYS.universal(params),
    queryFn: () => searchApi.universalSearch(params),
    enabled: true,
  });
}

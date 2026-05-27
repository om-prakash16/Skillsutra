import { fetchWithAuth } from "./api-client";

export interface SearchParams {
  q?: string;
  limit?: number;
  [key: string]: any;
}

export interface HybridSearchParams extends SearchParams {
  job_status?: string;
  remote_only?: boolean;
  min_salary?: number;
  location?: string;
  required_skills?: string[];
  sort_by?: "relevance" | "recent" | "salary" | "hybrid";
}

export const searchApi = {
  /**
   * Universal autocomplete for global search bar
   */
  autocomplete: (query: string, limit = 5) => {
    if (!query) return Promise.resolve({ jobs: [], profiles: [], companies: [], skills: [] });
    return fetchWithAuth(`/search/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`);
  },

  /**
   * Hybrid search for Jobs
   */
  searchJobs: (params: HybridSearchParams) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    return fetchWithAuth(`/search/jobs?${queryParams.toString()}`);
  },

  /**
   * Hybrid search for Candidates / Talent
   */
  searchTalent: (params: HybridSearchParams) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    return fetchWithAuth(`/search/talent?${queryParams.toString()}`);
  },
  
  /**
   * Universal hybrid search across all entities (For deep search)
   */
  universalSearch: (params: SearchParams) => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append("q", params.q);
    if (params.limit) queryParams.append("limit", String(params.limit));
    
    return fetchWithAuth(`/search/universal?${queryParams.toString()}`);
  }
};

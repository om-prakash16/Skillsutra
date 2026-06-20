/**
 * Public API Module
 * Endpoints that do not require authentication.
 */

import { API_BASE_URL } from "./api-client";

async function fetchPublic(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string>),
        },
    });

        // Handle No Content
        if (response.status === 204) return null;

        let json;
        try {
            json = await response.json();
        } catch (e) {
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            return null;
        }

        if (!response.ok) {
            const errorMsg = json.error?.message || json.detail || json.message || "API Request Failed";
            throw new Error(errorMsg);
        }

        // Support the new standardized response envelope {"status": "success", "data": ...}
        if (json && typeof json === "object" && "status" in json && "data" in json) {
            return json.data;
        }
        
        // Support enterprise envelope {"object": "item", "data": ...}
        if (json && typeof json === "object" && "object" in json && "data" in json) {
            return json.data;
        }

        return json;
}

/**
 * Normalize a raw backend job object into the shape the frontend UI expects.
 * Backend fields → Frontend fields:
 *   companies.company_name → company
 *   skills_required        → tags
 *   salary_range           → salary
 *   job_type               → type
 *   experience_level       → experience
 *   created_at             → postedAt (relative string)
 */
function normalizeJob(j: any): any {
    const createdAt = j.created_at ? new Date(j.created_at) : null;
    let postedAt = j.postedAt || "";
    if (!postedAt && createdAt) {
        const diffMs = Date.now() - createdAt.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) postedAt = "Today";
        else if (diffDays === 1) postedAt = "1d ago";
        else postedAt = `${diffDays}d ago`;
    }

    return {
        ...j,
        company: j.company || j.companies?.company_name || j.company_name || "Unknown Company",
        tags: j.tags || j.skills_required || j.keySkills || [],
        salary: j.salary || j.salary_range || "Competitive",
        type: j.type || j.job_type || "Full-time",
        experience: j.experience || j.experience_level || "",
        postedAt,
    };
}

export const publicApi = {
    jobs: {
        list: async () => {
            const data = await fetchPublic("/jobs/list");
            if (Array.isArray(data)) {
                return data.map(normalizeJob);
            }
            return data;
        },
        details: async (id: string) => {
            const data = await fetchPublic(`/jobs/details/${id}`);
            if (data && typeof data === 'object') {
                return normalizeJob(data);
            }
            return data;
        },
    },
    search: {
        candidates: (params: string) =>
            fetchPublic(`/search/talent?${params}`),
        jobs: (params: string) => fetchPublic(`/search/jobs?${params}`),
        companies: (params: string) => fetchPublic(`/search/companies?${params}`),
    },
    profile: {
        getById: (userId: string) => fetchPublic(`/profiles/public/${userId}`),
    },
    analytics: {
        public: () => fetchPublic("/analytics/public"),
    },
    ai: {
        matchByJd: (jdFile: File | null, jdText: string = "") => {
            const formData = new FormData();
            if (jdFile) formData.append("jd", jdFile);
            if (jdText) formData.append("jd_text_input", jdText);
            return fetch(`${API_BASE_URL}/ai/match-jd-candidates`, {
                method: "POST",
                body: formData,
            }).then(res => {
                if (!res.ok) throw new Error("JD Match Failed");
                return res.json();
            });
        }
    },
    health: () => fetchPublic("/"),
};

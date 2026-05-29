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

export const publicApi = {
    jobs: {
        list: () => fetchPublic("/jobs/list"),
        details: (id: string) => fetchPublic(`/jobs/details/${id}`),
    },
    search: {
        candidates: (params: string) =>
            fetchPublic(`/search/talent?${params}`),
        jobs: (params: string) => fetchPublic(`/search/jobs?${params}`),
        companies: (params: string) => fetchPublic(`/search/companies?${params}`),
    },
    profile: {
        getById: (userId: string) => fetchPublic(`/users/public/${userId}`),
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

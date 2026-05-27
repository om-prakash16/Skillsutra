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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "API Request Failed");
    }

    const json = await response.json();
    
    if (json && typeof json === "object" && "status" in json && "data" in json) {
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
            fetchPublic(`/search/candidates?${params}`),
        jobs: (params: string) => fetchPublic(`/search/jobs?${params}`),
        companies: (params: string) => fetchPublic(`/search/companies?${params}`),
    },
    profile: {
        getById: (userId: string) => fetchPublic(`/profile/public/${userId}`),
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

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

    return response.json();
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
    },
    analytics: {
        public: () => fetchPublic("/analytics/public"),
    },
    health: () => fetchPublic("/"),
};

/**
 * API Client
 * Central binding for all backend service calls.
 */

// Use relative path in browser to leverage Next.js proxy rewrites, preventing CORS and Docker host network issues.
// Use absolute URL on server-side rendering.
export const API_BASE_URL = typeof window !== 'undefined' 
  ? "/api/v1" 
  : (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1");

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
    })
    .then(async (res) => {
        if (!res.ok) throw new Error("Refresh failed");
        const json = await res.json();
        const data = json.data || json;
        if (data.access_token) {
            localStorage.setItem("accessToken", data.access_token);
            if (data.refresh_token) {
                localStorage.setItem("refreshToken", data.refresh_token);
            }
            document.cookie = `auth_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
            return data.access_token as string;
        }
        throw new Error("No token returned");
    })
    .catch((err) => {
        console.error("Session refresh failed:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        document.cookie = "auth_token=; path=/; max-age=0;";
        window.location.href = "/auth/login?expired=true";
        return null;
    })
    .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
    });

    return refreshPromise;
}

export async function fetchWithAuth(endpoint: string, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = 10000, ...fetchOptions } = options;
    const token = localStorage.getItem("accessToken");

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const isFormData = fetchOptions.body instanceof FormData;
    
    const headers: Record<string, string> = {
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const makeRequest = async (currentAuth: string | null) => {
        if (currentAuth) headers["Authorization"] = `Bearer ${currentAuth}`;
        
        return fetch(`${API_BASE_URL}${endpoint}`, {
            ...fetchOptions,
            headers: headers as HeadersInit,
            signal: controller.signal,
        });
    };

    try {
        let response = await makeRequest(token);

        if (response.status === 401 && localStorage.getItem("refreshToken")) {
            // Token expired, attempt refresh
            const newToken = await refreshAccessToken();
            if (newToken) {
                response = await makeRequest(newToken);
            }
        }

        clearTimeout(id);
        
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
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection.');
        }
        throw error;
    }
}

// API module bindings
export const api = {
    get: (endpoint: string) => fetchWithAuth(endpoint),
    post: (endpoint: string, data?: any) => fetchWithAuth(endpoint, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
    put: (endpoint: string, data?: any) => fetchWithAuth(endpoint, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
    patch: (endpoint: string, data?: any) => fetchWithAuth(endpoint, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
    delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }),
    auth: {
        sync: (requested_role?: string) => 
            fetchWithAuth("/auth/sync", { 
                method: "POST", 
                body: JSON.stringify({ requested_role }) 
            }),
        me: () => fetchWithAuth("/auth/me"),
        assignRole: (user_id: string, role: string) =>
            fetchWithAuth("/auth/assign-role", {
                method: "POST",
                body: JSON.stringify({ user_id, role })
            }),
    },
    profile: {
        getSchema: () => fetchWithAuth("/profile/schema"),
        get: () => fetchWithAuth("/users"),
        update: (data: any) => fetchWithAuth("/users/update", { method: "POST", body: JSON.stringify(data) }),
        uploadFile: (formData: FormData) => fetchWithAuth("/profile/upload-file", { method: "POST", body: formData, headers: { "Content-Type": "multipart/form-data" } })
    },
    publicProfile: {
        getByUsername: (username: string) => fetchWithAuth(`/profiles/public/${username}`),
        checkUsername: (username: string) => fetchWithAuth(`/profiles/check-username/${username}`),
        claimUsername: (username: string) => fetchWithAuth("/profiles/claim-username", { method: "POST", body: JSON.stringify({ username }) })
    },
    ai: {
        analyze: (data: any) => fetchWithAuth("/ai/analyze-profile", { method: "POST", body: JSON.stringify({ profile_data: data }) }),
        getScores: (userId?: string) => fetchWithAuth(`/ai/scores${userId ? `?user_id=${userId}` : ""}`),
        recommendSkills: () => fetchWithAuth("/ai/recommend-skills", { method: "POST" })
    },
    company: {
        create: (data: any) => fetchWithAuth("/company/create", { method: "POST", body: JSON.stringify(data) }),
        get: () => fetchWithAuth("/company/profile"),
        invite: (wallet_address: string, role: string) => fetchWithAuth("/company/invite-member", { method: "POST", body: JSON.stringify({ wallet_address, role }) }),
        getTeam: () => fetchWithAuth("/company/team")
    },
    jobs: {
        create: (data: any) => fetchWithAuth("/jobs/create", { method: "POST", body: JSON.stringify(data) }),
        list: () => fetchWithAuth("/jobs/list"),
        details: (id: string) => fetchWithAuth(`/jobs/details/${id}`),
        discovery: (jobId: string) => fetchWithAuth(`/jobs/${jobId}/discovery`),
        apply: (jobId: string) => fetchWithAuth("/jobs/apply", { method: "POST", body: JSON.stringify({ job_id: jobId }) }),
        save: (jobId: string) => fetchWithAuth("/users/saved-items", { method: "POST", body: JSON.stringify({ item_type: "job", item_id: jobId }) }),
        unsave: (jobId: string) => fetchWithAuth("/users/saved-items", { method: "POST", body: JSON.stringify({ item_type: "job", item_id: jobId }) }),
        getSaved: () => fetchWithAuth("/users/saved-items?item_type=job"),
        listCompanyJobs: (companyId: string) => fetchWithAuth(`/jobs/company-metrics/${companyId}`),
        submitAssessment: (id: string, data: any) => fetchWithAuth(`/jobs/applications/${id}/submit-assessment`, { method: "PATCH", body: JSON.stringify(data) }),
        parseJD: (text: string) => fetchWithAuth("/jobs/parse-jd", { method: "POST", body: JSON.stringify({ text }) }),
    },
    applications: {
        user: () => fetchWithAuth("/applications/my-applications"),
        company: (id: string, jobId?: string) => fetchWithAuth(`/applications/company-applications${jobId ? `?job_id=${jobId}` : ""}`),
        updateStatus: (id: string, status: string) => fetchWithAuth(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
        getPipeline: (jobId: string) => fetchWithAuth(`/applications/jobs/${jobId}/pipeline`),
        updateStage: (appId: string, stageId: string) => fetchWithAuth(`/applications/${appId}/stage`, { method: "PUT", body: JSON.stringify({ stage_id: stageId }) }),
    },
    Verifications: {
        mintProfile: () => fetchWithAuth("/Verifications/issue-profile", { method: "POST" }),
        updateMetadata: (cid: string) => fetchWithAuth("/Verifications/update-metadata", { method: "POST", body: JSON.stringify({ cid }) }),
        list: () => fetchWithAuth("/Verifications/user-Verifications")
    },
    search: {
        candidates: (params: string) => fetchWithAuth(`/search/candidates?${params}`),
        jobs: (params: string) => fetchWithAuth(`/search/jobs?${params}`)
    },
    notifications: {
        get: () => fetchWithAuth("/notifications/list"),
        read: (id: string) => fetchWithAuth(`/notifications/${id}/read`, { method: "PATCH" })
    },
    activity: {
        user: (limit = 20) => fetchWithAuth(`/activity/user?limit=${limit}`),
        company: (limit = 20) => fetchWithAuth(`/activity/company?limit=${limit}`),
        admin: (limit = 50) => fetchWithAuth(`/activity/superadmin?limit=${limit}`),
        record: (data: any) => fetchWithAuth("/activity/record", { method: "POST", body: JSON.stringify(data) }),
    },
    analytics: {
        user: () => fetchWithAuth("/analytics/user"),
        company: () => fetchWithAuth("/analytics/company"),
        admin: () => fetchWithAuth("/analytics/superadmin"),
        public: () => fetchWithAuth("/analytics/public"),
    },
    insights: {
        user: () => fetchWithAuth("/analytics/insights/user"),
        company: () => fetchWithAuth("/analytics/insights/company"),
        admin: () => fetchWithAuth("/analytics/insights/superadmin"),
    },
    sync: {
        profile: () => fetchWithAuth("/sync/profile", { method: "POST" }),
        status: () => fetchWithAuth("/sync/status"),
        retry: (type: string) => fetchWithAuth("/sync/retry", { method: "POST", body: JSON.stringify({ entity_type: type }) })
    },
    admin: {
        getDashboard: () => fetchWithAuth("/superadmin/dashboard"),
        getPublicFeatures: () => fetchWithAuth("/superadmin/features/public"),
        getUsers: () => fetchWithAuth("/superadmin/users"),
        updateUser: (account: string, data: any) => fetchWithAuth(`/superadmin/users/${account}`, { method: "PATCH", body: JSON.stringify(data) }),
        getSchema: () => fetchWithAuth("/superadmin/schema"),
        createSchema: (data: any) => fetchWithAuth("/superadmin/schema", { method: "POST", body: JSON.stringify(data) }),
        updateSchema: (id: string, data: any) => fetchWithAuth(`/superadmin/schema/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
        deleteSchema: (id: string) => fetchWithAuth(`/superadmin/schema/${id}`, { method: "DELETE" }),
        getFeatures: () => fetchWithAuth("/superadmin/features"),
        updateFeature: (data: any) => fetchWithAuth("/superadmin/features/update", { method: "POST", body: JSON.stringify(data) }),
        getSettings: () => fetchWithAuth("/superadmin/settings"),
        updateSettings: (data: any) => fetchWithAuth("/superadmin/settings", { method: "POST", body: JSON.stringify(data) }),
        getBlockchainTransactions: () => fetchWithAuth("/superadmin/infrastructure/transactions"),
        getCompanies: () => fetchWithAuth("/superadmin/companies"),
        verifyCompany: (id: string) => fetchWithAuth(`/superadmin/companies/${id}/verify`, { method: "PATCH" }),
        deleteCompany: (id: string) => fetchWithAuth(`/superadmin/companies/${id}`, { method: "DELETE" }),
        getAllJobs: () => fetchWithAuth("/superadmin/all-jobs"),
        deleteJob: (id: string) => fetchWithAuth(`/superadmin/jobs/${id}`, { method: "DELETE" }),
        getAllApplications: () => fetchWithAuth("/superadmin/all-applications"),
        getSkills: () => fetchWithAuth("/superadmin/skills"),
        createSkill: (data: any) => fetchWithAuth("/superadmin/skills", { method: "POST", body: JSON.stringify(data) }),
        getReports: (params: string) => fetchWithAuth(`/superadmin/reports?${params}`),
        resolveReport: (data: any) => fetchWithAuth("/superadmin/reports/resolve", { method: "PATCH", body: JSON.stringify(data) }),
        getSubscriptions: () => fetchWithAuth("/superadmin/subscriptions"),
        updateSubscription: (id: string, data: any) => fetchWithAuth(`/superadmin/subscriptions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
        getSkillFlags: (status?: string) => fetchWithAuth(`/superadmin/skill-flags${status ? `?status=${status}` : ""}`),
        reviewSkillFlag: (id: string, data: any) => fetchWithAuth(`/superadmin/skill-flags/review/${id}`, { method: "POST", body: JSON.stringify(data) }),
        getTickets: (status?: string) => fetchWithAuth(`/superadmin/tickets${status ? `?status=${status}` : ""}`),
        updateTicket: (id: string, data: any) => fetchWithAuth(`/superadmin/tickets/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
        getAuditLogs: () => fetchWithAuth("/superadmin/audit-logs"),
        flagUser: (data: any) => fetchWithAuth("/superadmin/users/flag", { method: "POST", body: JSON.stringify(data) }),
    },
    recruiter: {
        getFunnel: () => fetchWithAuth("/recruiter/analytics/funnel"),
    },
    cms: {
        all: () => fetchWithAuth("/cms"),
        section: (section: string) => fetchWithAuth(`/cms/${section}`),
        update: (data: any) => fetchWithAuth("/cms/update", { method: "PATCH", body: JSON.stringify(data) }),
        delete: (section: string, key: string) => fetchWithAuth(`/cms/${section}/${key}`, { method: "DELETE" }),
        // New CMS Routes
        getPages: () => fetchWithAuth("/cms/pages"),
        getPage: (id: string) => fetchWithAuth(`/cms/pages/${id}`),
        createPage: (data: any) => fetchWithAuth("/cms/pages", { method: "POST", body: JSON.stringify(data) }),
        updatePage: (id: string, data: any) => fetchWithAuth(`/cms/pages/${id}`, { method: "PUT", body: JSON.stringify(data) }),
        deletePage: (id: string) => fetchWithAuth(`/cms/pages/${id}`, { method: "DELETE" }),
        getArticles: () => fetchWithAuth("/cms/articles"),
        getArticle: (id: string) => fetchWithAuth(`/cms/articles/${id}`),
        createArticle: (data: any) => fetchWithAuth("/cms/articles", { method: "POST", body: JSON.stringify(data) }),
        updateArticle: (id: string, data: any) => fetchWithAuth(`/cms/articles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
        deleteArticle: (id: string) => fetchWithAuth(`/cms/articles/${id}`, { method: "DELETE" }),
        getBanners: () => fetchWithAuth("/cms/banners"),
        getTaxonomy: () => fetchWithAuth("/cms/taxonomy"),
    },
    career: {
        getGoals: () => fetchWithAuth("/career/goals"),
        createGoal: (data: any) => fetchWithAuth("/career/goals", { method: "POST", body: JSON.stringify(data) }),
        addTask: (data: any) => fetchWithAuth("/career/tasks", { method: "POST", body: JSON.stringify(data) }),
    },
    identity: {
        getTimeline: (userId: string) => fetchWithAuth(`/connections/timeline/${userId}`),
        requestConnection: (targetUserId: string) => fetchWithAuth("/connections/request", { method: "POST", body: JSON.stringify({ target_user_id: targetUserId }) }),
        getConnections: () => fetchWithAuth("/connections/list"),
        submit: (data: { id_type: string, document_url: string }) => fetchWithAuth("/profile/identity/submit", { method: "POST", body: JSON.stringify(data) }),
        getStatus: (userId?: string) => fetchWithAuth(`/profile/identity/status${userId ? `?user_id=${userId}` : ""}`),
    },
    interview: {
        generate: (userId: string, jobId: string, count: number = 10) => fetchWithAuth("/ai/generate-interview-questions", { method: "POST", body: JSON.stringify({ user_id: userId, job_id: jobId, count }) }),
        get: (userId: string, jobId?: string) => fetchWithAuth(`/ai/interview-questions?user_id=${userId}${jobId ? `&job_id=${jobId}` : ""}`),
        set: (userId: string, jobId: string, questions: any[]) => fetchWithAuth(`/ai/set-interview-questions?user_id=${userId}&job_id=${jobId}`, { method: "POST", body: JSON.stringify(questions) }),
    },
    chat: {
        getRooms: () => fetchWithAuth("/chat/rooms"),
        getHistory: (roomId: string) => fetchWithAuth(`/chat/history/${roomId}`),
    },

    messages: {
        getInbox: () => fetchWithAuth("/messages/inbox"),
        getHistory: (conversationId: string) => fetchWithAuth(`/messages/${conversationId}/history`),
        startConversation: (data: { receiver_id: string, subject?: string, initial_message: string }) => 
            fetchWithAuth("/messages/start", { method: "POST", body: JSON.stringify(data) }),
        sendMessage: (conversationId: string, content: string) => 
            fetchWithAuth(`/messages/${conversationId}/send`, { method: "POST", body: JSON.stringify({ content }) }),
    },
    competitions: {
        get: () => fetchWithAuth("/competitions"),
        post: (data: any) => fetchWithAuth("/competitions", { method: "POST", body: JSON.stringify(data) }),
        delete: (id: string) => fetchWithAuth(`/competitions/${id}`, { method: "DELETE" })
    },
    talentPool: {
        get: () => fetchWithAuth("/talent-pool"),
        post: (data: any) => fetchWithAuth("/talent-pool", { method: "POST", body: JSON.stringify(data) }),
        delete: (id: string) => fetchWithAuth(`/talent-pool/${id}`, { method: "DELETE" })
    },
    feed: {
        getPosts: (limit = 20, offset = 0) => fetchWithAuth(`/social/feed?limit=${limit}&offset=${offset}`),
        createPost: (data: any) => fetchWithAuth("/social/posts", { method: "POST", body: JSON.stringify(data) }),
        toggleLike: (postId: string) => fetchWithAuth(`/social/posts/${postId}/like`, { method: "POST" }),
    }
};

// ─── Domain-Specific API Modules (Preferred) ─────────────────
// New code should import from these domain modules:
//   import { userApi } from "@/lib/api/user-api"
//   import { companyApi } from "@/lib/api/company-api"
//   import { adminApi } from "@/lib/api/superadmin-api"
//   import { publicApi } from "@/lib/api/public-api"
//   import { authApi } from "@/lib/api/auth-api"
//
// The unified `api` object above is preserved for backward compatibility.
// ──────────────────────────────────────────────────────────────

export * as authApi from "./auth-api";
export { userApi } from "./user-api";
export { companyApi } from "./company-api";
export { adminApi } from "./superadmin-api";
export { publicApi } from "./public-api";
export { searchApi } from "./search-api";

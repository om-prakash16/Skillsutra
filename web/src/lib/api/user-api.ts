/**
 * User / Candidate API Module
 * All endpoints accessible by regular users (candidates).
 */

import { fetchWithAuth } from "./api-client";

export const userApi = {
    profile: {
        getSchema: () => fetchWithAuth("/profile/schema"),
        get: () => fetchWithAuth("/profile"),
        update: (data: any) =>
            fetchWithAuth("/profile/update", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        uploadFile: (formData: FormData) =>
            fetchWithAuth("/profile/upload-file", {
                method: "POST",
                body: formData,
                headers: { "Content-Type": "multipart/form-data" },
            }),
    },
    skills: {
        get: (userId?: string) =>
            fetchWithAuth(`/profile/skills${userId ? `?user_id=${userId}` : ""}`),
        add: (data: any) =>
            fetchWithAuth("/profile/skills", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        requestVerification: (skillId: string) =>
            fetchWithAuth(`/profile/skills/${skillId}/verify`, { method: "POST" }),
    },
    portfolio: {
        get: (userId?: string) =>
            fetchWithAuth(`/profile/portfolio${userId ? `?user_id=${userId}` : ""}`),
    },
    ai: {
        analyze: (data: any) =>
            fetchWithAuth("/ai/analyze-profile", {
                method: "POST",
                body: JSON.stringify({ profile_data: data }),
            }),
        getScores: (userId?: string) =>
            fetchWithAuth(`/ai/scores${userId ? `?user_id=${userId}` : ""}`),
        recommendSkills: () =>
            fetchWithAuth("/ai/recommend-skills", { method: "POST" }),
    },
    jobs: {
        list: () => fetchWithAuth("/jobs/list"),
        details: (id: string) => fetchWithAuth(`/jobs/details/${id}`),
        apply: (jobId: string) =>
            fetchWithAuth("/jobs/apply", {
                method: "POST",
                body: JSON.stringify({ job_id: jobId }),
            }),
        save: (jobId: string) =>
            fetchWithAuth("/jobs/save", {
                method: "POST",
                body: JSON.stringify({ job_id: jobId }),
            }),
        unsave: (jobId: string) =>
            fetchWithAuth(`/jobs/unsave/${jobId}`, { method: "DELETE" }),
        getSaved: () => fetchWithAuth("/jobs/saved"),
        submitAssessment: (id: string, data: any) =>
            fetchWithAuth(`/jobs/applications/${id}/submit-assessment`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
    },
    applications: {
        user: () => fetchWithAuth("/applications/user"),
    },
    nft: {
        mintProfile: () => fetchWithAuth("/nft/mint-profile", { method: "POST" }),
        updateMetadata: (cid: string) =>
            fetchWithAuth("/nft/update-metadata", {
                method: "POST",
                body: JSON.stringify({ cid }),
            }),
        list: () => fetchWithAuth("/nft/user-nfts"),
    },
    notifications: {
        get: () => fetchWithAuth("/notifications/list"),
        read: (id: string) =>
            fetchWithAuth(`/notifications/${id}/read`, { method: "PATCH" }),
    },
    activity: {
        user: (limit = 20) => fetchWithAuth(`/activity/user?limit=${limit}`),
        record: (data: any) =>
            fetchWithAuth("/activity/record", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    },
    analytics: {
        user: () => fetchWithAuth("/analytics/user"),
    },
    insights: {
        user: () => fetchWithAuth("/analytics/insights/user"),
    },
    sync: {
        profile: () => fetchWithAuth("/sync/profile", { method: "POST" }),
        status: () => fetchWithAuth("/sync/status"),
        retry: (type: string) =>
            fetchWithAuth("/sync/retry", {
                method: "POST",
                body: JSON.stringify({ entity_type: type }),
            }),
    },
    career: {
        getGoals: () => fetchWithAuth("/career/goals"),
        createGoal: (data: any) =>
            fetchWithAuth("/career/goals", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        addTask: (data: any) =>
            fetchWithAuth("/career/tasks", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    },
    identity: {
        getTimeline: (userId: string) =>
            fetchWithAuth(`/connections/timeline/${userId}`),
        requestConnection: (targetUserId: string) =>
            fetchWithAuth("/connections/request", {
                method: "POST",
                body: JSON.stringify({ target_user_id: targetUserId }),
            }),
        getConnections: () => fetchWithAuth("/connections/list"),
        submit: (data: { id_type: string; document_url: string }) =>
            fetchWithAuth("/profile/identity/submit", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        getStatus: (userId?: string) =>
            fetchWithAuth(
                `/profile/identity/status${userId ? `?user_id=${userId}` : ""}`
            ),
    },
    interview: {
        generate: (jobId: string, count: number = 10) =>
            fetchWithAuth("/ai/generate-interview-questions", {
                method: "POST",
                body: JSON.stringify({ job_id: jobId, count }),
            }),
        get: (jobId?: string) =>
            fetchWithAuth(
                `/ai/interview-questions${jobId ? `?job_id=${jobId}` : ""}`
            ),
    },
    chat: {
        getRooms: () => fetchWithAuth("/chat/rooms"),
        getHistory: (roomId: string) =>
            fetchWithAuth(`/chat/history/${roomId}`),
    },
};

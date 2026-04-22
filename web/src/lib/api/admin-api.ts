/**
 * Admin API Module
 * All endpoints restricted to admin-role users.
 */

import { fetchWithAuth } from "./api-client";

export const adminApi = {
    // -- User Management --
    getUsers: () => fetchWithAuth("/admin/users"),
    updateUser: (wallet: string, data: any) =>
        fetchWithAuth(`/admin/users/${wallet}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
    flagUser: (data: any) =>
        fetchWithAuth("/admin/users/flag", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Dynamic Schema --
    getSchema: () => fetchWithAuth("/admin/schema"),
    createSchema: (data: any) =>
        fetchWithAuth("/admin/schema", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    updateSchema: (id: string, data: any) =>
        fetchWithAuth(`/admin/schema/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
    deleteSchema: (id: string) =>
        fetchWithAuth(`/admin/schema/${id}`, { method: "DELETE" }),

    // -- Feature Flags --
    getFeatures: () => fetchWithAuth("/admin/features"),
    updateFeature: (data: any) =>
        fetchWithAuth("/admin/features/update", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Platform Settings --
    getSettings: () => fetchWithAuth("/admin/settings"),
    updateSettings: (data: any) =>
        fetchWithAuth("/admin/settings", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Company Moderation --
    getCompanies: () => fetchWithAuth("/admin/companies"),
    verifyCompany: (id: string) =>
        fetchWithAuth(`/admin/companies/${id}/verify`, { method: "PATCH" }),
    deleteCompany: (id: string) =>
        fetchWithAuth(`/admin/companies/${id}`, { method: "DELETE" }),

    // -- Job & Application Oversight --
    getAllJobs: () => fetchWithAuth("/admin/all-jobs"),
    deleteJob: (id: string) =>
        fetchWithAuth(`/admin/jobs/${id}`, { method: "DELETE" }),
    getAllApplications: () => fetchWithAuth("/admin/all-applications"),

    // -- Skill Taxonomy --
    getSkills: () => fetchWithAuth("/admin/skills"),
    createSkill: (data: any) =>
        fetchWithAuth("/admin/skills", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Blockchain --
    getBlockchainTransactions: () =>
        fetchWithAuth("/admin/blockchain/transactions"),

    // -- Reports & Moderation --
    getReports: (params: string) =>
        fetchWithAuth(`/admin/reports?${params}`),
    resolveReport: (data: any) =>
        fetchWithAuth("/admin/reports/resolve", {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // -- Subscriptions --
    getSubscriptions: () => fetchWithAuth("/admin/subscriptions"),
    updateSubscription: (id: string, data: any) =>
        fetchWithAuth(`/admin/subscriptions/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // -- Skill Verification Flags --
    getSkillFlags: (status?: string) =>
        fetchWithAuth(
            `/admin/skill-flags${status ? `?status=${status}` : ""}`
        ),
    reviewSkillFlag: (id: string, data: any) =>
        fetchWithAuth(`/admin/skill-flags/review/${id}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Support Tickets --
    getTickets: (status?: string) =>
        fetchWithAuth(
            `/admin/tickets${status ? `?status=${status}` : ""}`
        ),
    updateTicket: (id: string, data: any) =>
        fetchWithAuth(`/admin/tickets/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // -- Audit Logs --
    getAuditLogs: () => fetchWithAuth("/admin/audit-logs"),

    // -- Activity & Analytics --
    activity: (limit = 50) =>
        fetchWithAuth(`/activity/admin?limit=${limit}`),
    analytics: () => fetchWithAuth("/analytics/admin"),
    insights: () => fetchWithAuth("/analytics/insights/admin"),

    // -- CMS --
    cms: {
        all: () => fetchWithAuth("/cms"),
        section: (section: string) => fetchWithAuth(`/cms/${section}`),
        update: (data: any) =>
            fetchWithAuth("/cms/update", {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        delete: (section: string, key: string) =>
            fetchWithAuth(`/cms/${section}/${key}`, { method: "DELETE" }),
    },
};

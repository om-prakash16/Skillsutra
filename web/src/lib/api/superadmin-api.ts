/**
 * Admin API Module
 * All endpoints restricted to admin-role users.
 */

import { fetchWithAuth } from "./api-client";

export const adminApi = {
    // -- User Management --
    getUsers: () => fetchWithAuth("/superadmin/users"),
    updateUser: (account: string, data: any) =>
        fetchWithAuth(`/superadmin/users/${account}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
    flagUser: (data: any) =>
        fetchWithAuth("/superadmin/users/flag", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Dynamic Schema --
    getSchema: () => fetchWithAuth("/superadmin/schema"),
    createSchema: (data: any) =>
        fetchWithAuth("/superadmin/schema", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    updateSchema: (id: string, data: any) =>
        fetchWithAuth(`/superadmin/schema/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
    deleteSchema: (id: string) =>
        fetchWithAuth(`/superadmin/schema/${id}`, { method: "DELETE" }),

    // -- Feature Flags --
    getFeatures: () => fetchWithAuth("/superadmin/features"),
    updateFeature: (data: any) =>
        fetchWithAuth("/superadmin/features/update", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Platform Settings --
    getSettings: () => fetchWithAuth("/superadmin/settings"),
    updateSettings: (data: any) =>
        fetchWithAuth("/superadmin/settings", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Company Moderation --
    getCompanies: () => fetchWithAuth("/superadmin/companies"),
    verifyCompany: (id: string) =>
        fetchWithAuth(`/superadmin/companies/${id}/verify`, { method: "PATCH" }),
    deleteCompany: (id: string) =>
        fetchWithAuth(`/superadmin/companies/${id}`, { method: "DELETE" }),

    // -- Job & Application Oversight --
    getAllJobs: () => fetchWithAuth("/superadmin/all-jobs"),
    deleteJob: (id: string) =>
        fetchWithAuth(`/superadmin/jobs/${id}`, { method: "DELETE" }),
    getAllApplications: () => fetchWithAuth("/superadmin/all-applications"),

    // -- Skill Taxonomy --
    getSkills: () => fetchWithAuth("/superadmin/skills"),
    createSkill: (data: any) =>
        fetchWithAuth("/superadmin/skills", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- infrastructure --
    getBlockchainTransactions: () =>
        fetchWithAuth("/superadmin/infrastructure/transactions"),

    // -- Reports & Moderation --
    getReports: (params: string) =>
        fetchWithAuth(`/superadmin/reports?${params}`),
    resolveReport: (data: any) =>
        fetchWithAuth("/superadmin/reports/resolve", {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // -- Subscriptions --
    getSubscriptions: () => fetchWithAuth("/superadmin/subscriptions"),
    updateSubscription: (id: string, data: any) =>
        fetchWithAuth(`/superadmin/subscriptions/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // -- Skill Verification Flags --
    getSkillFlags: (status?: string) =>
        fetchWithAuth(
            `/superadmin/skill-flags${status ? `?status=${status}` : ""}`
        ),
    reviewSkillFlag: (id: string, data: any) =>
        fetchWithAuth(`/superadmin/skill-flags/review/${id}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // -- Support Tickets --
    getTickets: (status?: string) =>
        fetchWithAuth(
            `/superadmin/tickets${status ? `?status=${status}` : ""}`
        ),
    updateTicket: (id: string, data: any) =>
        fetchWithAuth(`/superadmin/tickets/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // -- Audit Logs --
    getAuditLogs: () => fetchWithAuth("/superadmin/audit-logs"),

    // -- Activity & Analytics --
    activity: (limit = 50) =>
        fetchWithAuth(`/activity/superadmin?limit=${limit}`),
    analytics: () => fetchWithAuth("/analytics/superadmin"),
    insights: () => fetchWithAuth("/analytics/insights/superadmin"),

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

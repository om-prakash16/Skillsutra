/**
 * Auth API Module
 * All authentication-related API calls.
 * Uses Keycloak for identity — these endpoints sync Keycloak users to local DB.
 */

import { fetchWithAuth } from "./api-client";

export const authApi = {
    /** Sync Keycloak user to local PostgreSQL after login */
    sync: (requested_role?: string) =>
        fetchWithAuth("/auth/sync", {
            method: "POST",
            body: JSON.stringify({ requested_role }),
        }),

    /** Get current user session data (JWT + local DB enrichment) */
    me: () => fetchWithAuth("/auth/me"),

    /** Admin: Assign a realm role to a user in Keycloak */
    assignRole: (userId: string, role: string) =>
        fetchWithAuth("/auth/assign-role", {
            method: "POST",
            body: JSON.stringify({ user_id: userId, role }),
        }),
};

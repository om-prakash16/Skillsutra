/**
 * Auth API Module
 * All authentication-related API calls.
 */

import { fetchWithAuth } from "./api-client";

export const authApi = {
    login: (wallet: string, signature: string) =>
        fetchWithAuth("/auth/wallet-login", {
            method: "POST",
            body: JSON.stringify({ wallet, signature }),
        }),
    me: () => fetchWithAuth("/auth/me"),
};

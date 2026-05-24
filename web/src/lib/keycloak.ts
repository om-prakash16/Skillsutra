import Keycloak from "keycloak-js"

/**
 * Keycloak client singleton.
 * Handles authentication, token management, and social login redirects
 * across Web, iOS (via AppAuth), and Android.
 */
export const keycloak = new Keycloak({
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "skillsutra",
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "skillsutra-web",
})

/**
 * Initialize Keycloak with silent SSO check.
 * Returns true if the user is already authenticated (e.g. valid session cookie).
 */
export async function initKeycloak(): Promise<boolean> {
    try {
        const authenticated = await keycloak.init({
            onLoad: "check-sso",
            silentCheckSsoRedirectUri:
                typeof window !== "undefined"
                    ? `${window.location.origin}/auth/callback`
                    : undefined,
            pkceMethod: "S256",
            checkLoginIframe: false,
        })
        return authenticated
    } catch (err) {
        console.error("[keycloak] init failed:", err)
        return false
    }
}

/**
 * Refresh the access token if it will expire within `minValidity` seconds.
 * Returns the fresh token string or null if refresh failed.
 */
export async function refreshToken(minValidity = 30): Promise<string | null> {
    try {
        const refreshed = await keycloak.updateToken(minValidity)
        if (refreshed) {
            console.debug("[keycloak] token refreshed")
        }
        return keycloak.token || null
    } catch {
        console.warn("[keycloak] token refresh failed — session expired")
        return null
    }
}

/**
 * Get the current access token, refreshing if needed.
 */
export async function getToken(): Promise<string | null> {
    if (!keycloak.authenticated) return null
    return refreshToken(30)
}

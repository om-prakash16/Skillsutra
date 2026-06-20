export function getPostLoginDestination(user: any): string | null {
    if (!user || !user.role) {
        console.error("[Auth] AUTH_INVALID_ROLE: Role missing on user payload", user);
        return null;
    }
    
    console.log(`[Auth] AUTH_REDIRECT_SELECTED: Determining redirect for role '${user.role}'`);

    switch (user.role) {
        case "super_admin":
        case "admin":
            return "/admin";
            
        case "security_admin":
            return "/admin/security";
            
        case "support_admin":
            return "/admin/support";
            
        case "ai_admin":
            return "/admin/ai";
            
        case "company":
            // If full user object from API
            if (user.companies !== undefined || user.active_company !== undefined) {
                const activeCompany = user.active_company || user.companies?.[0];
                if (activeCompany?.approval_status === "APPROVED" && activeCompany?.domain_verified) {
                    return "/company/dashboard";
                }
                return "/company/onboarding";
            }
            // If just from JWT token payload in middleware
            return "/company/dashboard";
            
        case "moderator":
            return "/moderation";
            
        case "mentor":
            return "/mentor";
            
        case "recruiter":
        case "career_professional":
        case "user":
        default:
            return "/feed";
    }
}

import { jwtVerify, JWTPayload } from "jose";

export async function verifyServerToken(token: string): Promise<JWTPayload | null> {
    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || "super-secret-key-please-change-in-production"
        );
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.error("[Auth] Token cryptographic verification failed", error);
        return null;
    }
}

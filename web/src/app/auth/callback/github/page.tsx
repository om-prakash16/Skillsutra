"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function GitHubCallbackHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setAuthSession, token } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const called = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        
        if (!code) {
            setError("No authorization code provided by GitHub.");
            return;
        }

        if (called.current) return;
        called.current = true;

        const handleGitHubCallback = async () => {
            try {
                const headers: Record<string, string> = {
                    "Content-Type": "application/json",
                };
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                // Post the code to the backend
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/oauth/github/callback`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ code, state }),
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.detail || "Authentication failed on server");
                }

                const data = await res.json();
                
                if (data.refresh_token === "linked") {
                    toast.success('GitHub account successfully linked!');
                    router.push("/user/skills");
                    return;
                }

                // Fetch user profile
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${data.access_token}` }
                });
                
                if (!userRes.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                
                const userData = await userRes.json();
                const userPayload = userData.data || userData;
                
                // Update global context so role-guards don't instantly redirect us
                setAuthSession(userPayload, data.access_token, data.refresh_token);
                
                toast.success('Successfully logged in with GitHub!');
                
                // Redirect based on role
                if (userPayload?.role === "admin") {
                    router.push("/admin");
                } else if (userPayload?.role === "company") {
                    router.push("/company/dashboard");
                } else {
                    router.push("/");
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to log in with GitHub");
                toast.error('Failed to log in with GitHub');
                setTimeout(() => router.push("/auth/login"), 3000);
            }
        };

        handleGitHubCallback();
    }, [searchParams, router, setAuthSession]);

    return (
        <div className="text-center space-y-4">
            {error ? (
                <>
                    <div className="text-destructive font-bold text-xl">Authentication Error</div>
                    <p className="text-muted-foreground">{error}</p>
                    <p className="text-sm">Redirecting back to login...</p>
                </>
            ) : (
                <>
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <div className="text-xl font-bold">Authenticating with GitHub...</div>
                    <p className="text-muted-foreground">Please wait while we securely log you in.</p>
                </>
            )}
        </div>
    );
}

export default function GitHubCallbackPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <Suspense fallback={
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <div className="text-xl font-bold">Loading...</div>
                </div>
            }>
                <GitHubCallbackHandler />
            </Suspense>
        </div>
    );
}

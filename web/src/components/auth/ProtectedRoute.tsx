"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(`/auth/login?redirectedFrom=${encodeURIComponent(pathname)}`);
        } else if (!isLoading && isAuthenticated && allowedRoles && user?.role) {
            if (!allowedRoles.includes(user.role)) {
                // If user role is not allowed, send them to their respective dashboard
                if (user.role === 'admin') router.replace("/admin");
                else if (user.role === 'company') router.replace("/company/dashboard");
                else router.replace("/user/dashboard");
            }
        }
    }, [isLoading, isAuthenticated, router, pathname, allowedRoles, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-black uppercase tracking-widest animate-pulse">Initializing Secure Session...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}

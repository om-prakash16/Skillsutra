"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/search/candidates");
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-pulse text-primary font-black italic tracking-tighter text-2xl uppercase">
                Synchronizing Nexus...
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { userApi } from "@/lib/api/user-api";
import { API_BASE_URL } from "@/lib/api/api-client";

export default function OnboardingPage() {
    const { user, setAuthSession, token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [name, setName] = useState("");

    useEffect(() => {
        if (user) {
            if (user.name && user.name !== "User") {
                setName(user.name);
            }
            if (user.dynamic_profile_data?.onboarding_completed) {
                // If they already completed onboarding, redirect
                redirectUser(user.role);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const redirectUser = (role: string) => {
        if (role === "super_admin" || role === "admin") router.push("/admin");
        else if (role === "company") router.push("/company/dashboard");
        else if (role === "mentor") router.push("/mentor");
        else if (role === "moderator") router.push("/moderation");
        else router.push("/feed");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.error("Please fill out your name.");
            return;
        }

        setLoading(true);
        try {
            // Merge existing dynamic profile data
            const existingDynamic = user?.dynamic_profile_data || {};
            
            const updatePayload = {
                username: name.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random()*100),
                dynamic_profile_data: {
                    ...existingDynamic,
                    onboarding_completed: true
                }
            };

            await userApi.profile.update(updatePayload);
            
            // Re-fetch me
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await res.json();
            const realUser = userData.data || userData;
            
            setAuthSession(realUser, token!, localStorage.getItem("refreshToken")!);
            toast.success("Profile setup complete!");
            
            redirectUser(realUser.role);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="glass border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden relative w-full max-w-md">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                <CardHeader className="space-y-4 items-center text-center pt-10 border-b border-border/50 pb-6">
                    <div className="glass bg-primary/10 p-3 rounded-xl mb-2 border border-primary/20 shadow-premium">
                        <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-extrabold font-heading tracking-tight text-gradient">Complete Your Profile</CardTitle>
                        <CardDescription className="text-micro text-muted-foreground/60 leading-relaxed">
                            Just a few more details to personalize your experience.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="pt-8 px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-micro text-muted-foreground/80 ml-2">Full Name</Label>
                            <Input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 glass border-border rounded-xl"
                                placeholder="John Doe"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="premium"
                            className="w-full h-12 rounded-xl text-sm shadow-premium font-bold tracking-widest uppercase mt-4"
                            disabled={loading || !name}
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete Setup"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

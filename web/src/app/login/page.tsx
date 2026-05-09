"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1a1a1a,transparent_70%)] opacity-50" />
      
      <div className="relative z-10 w-full max-w-md px-6">
         <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 mb-2">
               <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Best Hiring Tool</h1>
            <p className="text-muted-foreground text-sm font-medium">The future of verified talent.</p>
         </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-center">Identity Verification</CardTitle>
            <CardDescription className="text-center text-sm font-medium">Sign in with your Google account to access your profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <Button 
                onClick={() => signInWithGoogle()} 
                disabled={isLoading}
                className="w-full h-12 text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-all rounded-xl gap-2"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                    <>
                        <Mail className="w-5 h-5 mr-2" /> 
                        CONTINUE WITH GOOGLE 
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                )}
            </Button>

            <div className="text-center">
                <p className="text-xs text-neutral-500">
                    Secure authentication powered by Google.
                </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-neutral-600">
            By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span>.
            <br />
            Verified skills. Direct opportunity. No noise.
        </p>
      </div>
    </div>
  );
}

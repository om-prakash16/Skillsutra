"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { validateResetToken, resetPassword } from "@/lib/api/auth-api";
import { Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"validating" | "valid" | "invalid" | "submitting" | "success">("validating");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setErrorMessage("No reset token provided.");
      return;
    }

    const checkToken = async () => {
      try {
        await validateResetToken(token);
        setStatus("valid");
      } catch (err: any) {
        setStatus("invalid");
        setErrorMessage(err.message || "Invalid or expired reset token.");
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      await resetPassword(token as string, password);
      setStatus("success");
      setTimeout(() => {
        router.push("/auth/login?reset=success");
      }, 3000);
    } catch (err: any) {
      setStatus("valid"); 
      setErrorMessage(err.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <>
      {status === "validating" && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Validating your secure link...</p>
        </div>
      )}

      {status === "invalid" && (
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Link Expired or Invalid</h3>
          <p className="text-sm text-gray-400 mb-6">
            {errorMessage || "This password reset link is invalid or has expired."}
          </p>
          <Link
            href="/auth/forgot-password"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-foreground bg-muted/50 hover:bg-white/20 transition-all"
          >
            Request a new link
          </Link>
        </div>
      )}

      {status === "success" && (
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/10 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Password Reset Successful</h3>
          <p className="text-sm text-gray-400 mb-6">
            Your password has been updated securely. Redirecting to login...
          </p>
        </div>
      )}

      {(status === "valid" || status === "submitting") && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 shrink-0" />
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              New Password
            </label>
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-background/80 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-background/80 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status === "submitting" || !password || !confirmPassword}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-foreground bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#050505] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {status === "submitting" ? "Updating..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">Choose a new password</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Almost there. Create a strong, secure password for your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-muted/30 border border-white/[0.05] py-8 px-4 shadow-2xl backdrop-blur-xl sm:rounded-2xl sm:px-10">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

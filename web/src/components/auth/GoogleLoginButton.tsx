"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface GoogleLoginButtonProps {
  role?: string;
}

export default function GoogleLoginButton({ role = "user" }: GoogleLoginButtonProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthSession } = useAuth();
  const router = useRouter();

  // Use a ref to keep track of the latest role without causing handleSuccess to recreate
  const roleRef = useRef(role);
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  const handleSuccess = useCallback(async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      const currentRole = roleRef.current;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: credentialResponse.credential, role: currentRole }),
      });

      if (!res.ok) {
        throw new Error('Authentication failed on server');
      }

      const data = await res.json();
      // Fetch user profile
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });
      
      if (!userRes.ok) {
          throw new Error('Failed to fetch user profile');
      }
      
      const userData = await userRes.json();
      
      const userPayload = userData.data || userData;
      
      // Update global context so role-guards don't instantly redirect us
      setAuthSession(userPayload, data.access_token, data.refresh_token);
      
      toast.success('Successfully logged in!');
      if (userPayload?.role === "admin") {
          router.push("/admin");
      } else if (userPayload?.role === "company") {
          router.push("/company/dashboard");
      } else {
          router.push("/user/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to log in with Google');
    } finally {
      setIsLoading(false);
    }
  }, [router, setAuthSession]);

  return (
    <div className={`w-full flex justify-center ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          toast.error('Google login failed');
        }}
        theme="outline"
        size="large"
        text="continue_with"
      />
    </div>
  );
}

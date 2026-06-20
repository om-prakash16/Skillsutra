"use client";

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MicrosoftLoginButtonProps {
  role?: string;
  intent?: "login" | "register" | "link";
}

export default function MicrosoftLoginButton({ role = "user", intent = "login" }: MicrosoftLoginButtonProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithMicrosoft } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    await signInWithMicrosoft(role, intent);
    // Note: window will redirect, so setIsLoading(false) might not be strictly necessary, 
    // but we add it in case the redirect fails immediately.
    setTimeout(() => setIsLoading(false), 5000); 
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
      <Button
          type="button"
          variant="outline"
          className="w-full h-12 glass border-border hover:border-white/40 text-foreground hover:text-foreground transition-all font-bold uppercase text-[11px] tracking-widest rounded-xl flex items-center justify-center gap-3"
          onClick={handleLogin}
          disabled={isLoading}
      >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                  <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                      <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                      <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
                      <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
                      <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
                  </svg>
                  {intent === "register" ? "SIGN UP WITH MICROSOFT" : "SIGN IN WITH MICROSOFT"}
              </>
          )}
      </Button>
    </motion.div>
  );
}

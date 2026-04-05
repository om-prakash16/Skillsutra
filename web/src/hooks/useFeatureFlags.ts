"use client";

import { useState, useEffect, createContext, useContext } from "react";

type FeatureFlags = Record<string, boolean>;

const FeatureFlagsContext = createContext<FeatureFlags>({});

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>({});

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/features/list`);
      const data = await res.json();
      const flagMap = (data as any[]).reduce((acc, curr) => ({
        ...acc,
        [curr.feature_name]: curr.is_enabled
      }), {});
      setFlags(flagMap);
    } catch (err) {
      console.error("Failed to fetch feature flags", err);
    }
  };

  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider");
  }
  
  const isEnabled = (name: string) => !!context[name];
  
  return { flags: context, isEnabled };
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FeatureFlags {
  [key: string]: boolean;
}

interface FeatureContextType {
  flags: FeatureFlags;
  isLoading: boolean;
  isFeatureEnabled: (featureName: string) => boolean;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await fetch('/api/v1/features');
        const data = await response.json();
        setFlags(data.flags);
      } catch (error) {
        console.error('Failed to load feature flags', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const isFeatureEnabled = (featureName: string) => {
    return flags[featureName] === true;
  };

  return (
    <FeatureContext.Provider value={{ flags, isLoading, isFeatureEnabled }}>
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureProvider');
  }
  return context;
}

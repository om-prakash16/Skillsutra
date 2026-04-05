"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api/api-client";

interface CMSItem {
  section_key: string;
  content_key: string;
  content_value: string;
  metadata: any;
}

interface CMSContextType {
  content: CMSItem[];
  isLoading: boolean;
  getVal: (section: string, key: string, fallback?: string) => string;
  getJson: (section: string, key: string, fallback?: any) => any;
  getSection: (section: string) => CMSItem[];
  refresh: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CMSItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCMS = async () => {
    try {
      const data = await api.cms.all();
      setContent(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("CMS Provider Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  const getVal = (section: string, key: string, fallback: string = ""): string => {
    const item = content.find(c => c.section_key === section && c.content_key === key);
    return item ? item.content_value : fallback;
  };

  const getJson = (section: string, key: string, fallback: any = null): any => {
    const item = content.find(c => c.section_key === section && c.content_key === key);
    if (!item) return fallback;
    try {
      return JSON.parse(item.content_value);
    } catch (e) {
      console.error(`CMS JSON Parse Error for ${section}.${key}:`, e);
      return fallback;
    }
  };

  const getSection = (section: string): CMSItem[] => {
      return content.filter(c => c.section_key === section);
  }

  return (
    <CMSContext.Provider value={{ content, isLoading, getVal, getJson, getSection, refresh: fetchCMS }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}

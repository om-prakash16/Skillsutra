"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api/api-client";
import { useRouter } from "next/navigation";

interface CompanyContextType {
  company: any | null;
  role: string | null;
  permissions: any | null;
  isLoading: boolean;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  role: null,
  permissions: null,
  isLoading: true,
  refreshCompany: async () => {},
});

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const [company, setCompany] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCompany = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/company/profile");
      if (res.data?.data) {
        setCompany(res.data.data);
        setRole(res.data.data.my_role);
        setPermissions(res.data.data.my_permissions || {});
      } else {
        router.push("/company/setup"); // Redirect to setup if no company
      }
    } catch (error) {
      console.error("Failed to fetch company profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CompanyContext.Provider value={{ company, role, permissions, isLoading, refreshCompany: fetchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);

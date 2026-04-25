"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export type SyncState = "pending" | "synced" | "failed" | "outdated";

export function useSyncManager() {
  const [syncStatus, setSyncStatus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sync/status`);
      const data = await res.json();
      setSyncStatus(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerIPFSSync = async (type: string) => {
    setIsLoading(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sync/profile`, { method: "POST" });
        const data = await res.json();
        await fetchSyncStatus();
        toast.success("Metadata pinned to IPFS. Pending blockchain sync.");
        return data;
    } catch (err) {
        toast.error("Failed to pin metadata to IPFS.");
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const confirmBlockchainSync = async (type: string, txHash: string) => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sync/confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entity_type: type, tx_hash: txHash })
        });
        await fetchSyncStatus();
        toast.success("Identity synchronized with Solana!");
    } catch (err) {
        console.error(err);
    }
  };

  const getStatusFor = (type: string) => {
    return syncStatus.find(s => s.entity_type === type);
  };

  return { 
    syncStatus, 
    isLoading, 
    triggerIPFSSync, 
    confirmBlockchainSync, 
    getStatusFor,
    refreshStatus: fetchSyncStatus 
  };
}

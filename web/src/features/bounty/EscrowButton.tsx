"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Lock } from "lucide-react";

export default function EscrowButton({ amount, bountyId }: { amount: number, bountyId: string }) {
    const [loading, setLoading] = useState(false);

    const handleCreateEscrow = async () => {
        setLoading(true);
        try {
            // Simulated off-chain credit/escrow verification and lock
            setTimeout(() => {
                alert(`Successfully locked $${amount * 100} USD (equivalent to ${amount} SOL) in Escrow Vault for Bounty [${bountyId}]`);
                setLoading(false);
            }, 1000);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleCreateEscrow} disabled={loading} className="w-full flex gap-2">
            <Lock className="w-4 h-4" /> {loading ? "Locking Funds..." : `Escrow Vault Lock`}
        </Button>
    )
}

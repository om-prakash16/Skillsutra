"use client"
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

export default function CandidateDashboard() {
  const { publicKey, connected } = useWallet();

  const handleParseResume = async () => {
    alert("Simulating LangChain PDF Parser hitting FastAPI endpoint...");
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold font-heading">Candidate Dashboard</h1>
        {connected ? (
            <p className="text-primary font-mono bg-primary/10 inline-block px-3 py-1 rounded-md">Wallet: {publicKey?.toBase58()}</p>
        ) : (
            <p className="text-destructive">Wallet not connected.</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-xl shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Profile NFT Status</h2>
            <p className="text-sm text-muted-foreground">Upload your resume. Our AI will parse the data and mint your dynamic identity NFT.</p>
            <Button onClick={handleParseResume} variant="secondary">Upload & Parse Resume</Button>
            </div>
            
            <div className="p-6 border rounded-xl shadow-sm space-y-4 bg-muted/20">
            <h2 className="text-xl font-semibold">AI Matchmaker</h2>
            <p className="text-sm text-muted-foreground">You currently have a 92% match score for the 'Senior Rust Dev' position.</p>
            <Button>View Matching Jobs</Button>
            </div>
        </div>
      </div>
    </div>
  );
}

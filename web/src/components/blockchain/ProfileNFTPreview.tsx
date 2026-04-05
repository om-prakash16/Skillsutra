"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Share2, ExternalLink, RefreshCw, Loader2, User } from "lucide-react";

interface ProfileNFTProps {
    nft: {
        nft_address: string;
        metadata_cid: string;
        created_at: string;
    } | null;
    isLoading: boolean;
    onSync: () => void;
}

export function ProfileNFTPreview({ nft, isLoading, onSync }: ProfileNFTProps) {
  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10 animate-pulse">
        <CardContent className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!nft) {
    return (
      <Card className="bg-white/5 border-white/10 p-12 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <User className="w-8 h-8 text-neutral-500" />
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-bold italic tracking-tight font-heading">Digital Identity Not Found</h3>
            <p className="text-neutral-500 text-sm max-w-xs mx-auto italic">Mint your verifiable professional identity on Solana to unlock full marketplace potential.</p>
        </div>
        <Button className="bg-white text-black hover:bg-neutral-200 font-black px-8">
            MINT IDENTITY NFT
        </Button>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0A0A0A] border-white/10 overflow-hidden relative border-t-primary/30 group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <ShieldCheck className="w-32 h-32 text-primary" />
      </div>

      <CardHeader className="border-b border-white/10">
        <div className="flex justify-between items-center">
           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-0.5 text-[10px] font-black italic">
             VERIFIED IDENTITY NFT
           </Badge>
           <span className="text-[10px] font-mono text-neutral-500 italic">Solana Mainnet</span>
        </div>
        <CardTitle className="text-3xl font-black italic tracking-tighter mt-4">Candidate Identity #142</CardTitle>
        <CardDescription className="font-mono text-[10px] truncate max-w-[200px]">
           {nft.nft_address}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-neutral-800 border border-white/10 flex items-center justify-center relative overflow-hidden">
             <ShieldCheck className="w-24 h-24 text-primary animate-pulse" />
             <div className="absolute bottom-4 left-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/5">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">Immutable Metadata CID</p>
                <p className="text-[10px] font-mono text-primary text-center truncate">{nft.metadata_cid}</p>
             </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 font-bold text-xs flex items-center gap-2">
                <Share2 className="w-4 h-4" /> SHARE
            </Button>
            <Button className="bg-white text-black hover:bg-neutral-200 font-bold text-xs flex items-center gap-2" onClick={onSync}>
                <RefreshCw className="w-4 h-4" /> SYNC CID
            </Button>
        </div>

        <div className="pt-4 text-center">
           <a 
            href={`https://explorer.solana.com/address/${nft.nft_address}`} 
            target="_blank" 
            className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-1 hover:text-white transition-colors"
           >
              <ExternalLink className="w-3 h-3" /> View On Solana Explorer
           </a>
        </div>
      </CardContent>
    </Card>
  );
}

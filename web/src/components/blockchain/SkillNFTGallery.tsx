"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Verified, FileBadge, ArrowRight, Loader2, Award } from "lucide-react";

interface SkillNFTProps {
    nfts: {
        id: string;
        nft_address: string;
        nft_type: string;
        metadata_cid: string;
        created_at: string;
    }[];
    isLoading: boolean;
}

export function SkillNFTGallery({ nfts, isLoading }: SkillNFTProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-white/5 border-white/10 animate-pulse">
            <CardContent className="h-[200px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const skillNfts = nfts.filter(nft => nft.nft_type === 'skill');

  if (skillNfts.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10 p-12 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Award className="w-8 h-8 text-neutral-500" />
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-bold italic tracking-tight font-heading">No Skill Certificates</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto italic">Complete AI quizzes to earn verifiable skill NFTs and boost your hiring credibility.</p>
        </div>
        <Button className="bg-white text-black hover:bg-neutral-200 font-black px-8">
            TAKE AI QUIZ
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillNfts.map(nft => (
            <Card key={nft.id} className="bg-black border-white/10 overflow-hidden relative group hover:border-primary/50 transition-all duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Verified className="w-20 h-20 text-primary" />
                </div>
                
                <CardHeader className="pb-2">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-0.5 text-[10px] font-black italic">
                        AI-VERIFIED CERTIFICATE
                    </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black italic tracking-tighter">Python Backend Engineer</h3>
                        <p className="text-[10px] font-mono text-neutral-500 truncate">{nft.nft_address}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Mastery Score</p>
                            <p className="text-2xl font-black text-emerald-500 italic">92%</p>
                        </div>
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <FileBadge className="w-6 h-6 text-primary" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <a 
                            href={`https://explorer.solana.com/address/${nft.nft_address}`} 
                            target="_blank" 
                            className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-1 hover:text-white transition-colors py-2"
                        >
                            EXPLORER <ArrowRight className="w-3 h-3" />
                        </a>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}

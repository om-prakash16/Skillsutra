"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Zap, Shield, ShoppingCart, Star, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FeatureToggleCardProps {
    feature: any;
    onToggle: (name: string, status: boolean) => Promise<void>;
}

export function FeatureToggleCard({ feature, onToggle }: FeatureToggleCardProps) {
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(feature.is_enabled);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    try {
        await onToggle(feature.feature_name, checked);
        setIsEnabled(checked);
        toast.success(`Feature ${checked ? 'Enabled' : 'Disabled'}: ${feature.feature_name}`);
    } catch (err) {
        toast.error("Failed to update feature status.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card className="bg-[#050505] border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden relative group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 bg-white/5 transition-colors group-hover:bg-white/10`}>
                {getCategoryIcon(feature.category)}
            </div>
            <Switch 
                checked={isEnabled} 
                onCheckedChange={handleToggle} 
                disabled={loading}
                className="data-[state=checked]:bg-primary"
            />
        </div>
        <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 border-white/5 px-2 py-0">
                    {feature.category}
                </Badge>
                {isEnabled && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
            </div>
            <CardTitle className="text-xl font-black italic tracking-tighter uppercase">{feature.feature_name.replace('enable_', '').replace(/_/g, ' ')}</CardTitle>
            <CardDescription className="text-xs text-neutral-500 font-medium italic line-clamp-2 leading-relaxed">
                {feature.description || 'No description provided.'}
            </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4 flex justify-between items-center text-[9px] font-mono text-neutral-600 uppercase border-t border-white/5 mt-4 pt-4">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated: {new Date(feature.updated_at).toLocaleDateString()}</span>
          <span className="truncate max-w-[100px]">ID: {feature.id.slice(0, 8)}...</span>
      </CardContent>
    </Card>
  );
}

function getCategoryIcon(category: string) {
    switch (category) {
        case 'ai': return <Zap className="w-5 h-5 text-amber-500" />;
        case 'web3': return <Shield className="w-5 h-5 text-primary" />;
        case 'marketplace': return <ShoppingCart className="w-5 h-5 text-sky-500" />;
        case 'advanced': return <Star className="w-5 h-5 text-rose-500" />;
        default: return <Star className="w-5 h-5 text-neutral-400" />;
    }
}

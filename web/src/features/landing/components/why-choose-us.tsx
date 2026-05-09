'use client';

import { ShieldCheck, Zap, BarChart3, Users, Briefcase, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/cms-context';
import { Badge } from '@/components/ui/badge';

const ICON_MAP: Record<string, any> = {
  ShieldCheck, Zap, BarChart3, Users, Briefcase, BadgeCheck
};

export function WhyChooseUs() {
  const { getVal, getJson } = useCMS();

  const title = getVal("features", "title", "The Verified Choice");
  const subtitle = getVal("features", "subtitle", "We've discarded traditional hiring friction for verified cryptographic certainty.");
  const features = getJson("features", "cards") || [
    { title: 'Precision Verification', description: 'Verified proof of expertise through algorithmic skill assessments and real-world project validation.', icon: 'ShieldCheck' },
    { title: 'AI Match Resonance', description: 'Advanced AI analyzes technical data to find perfect matches with mathematical certainty and culture fit.', icon: 'Zap' },
    { title: 'Talent Marketplace', description: 'Access a global network of pre-vetted engineers and industry leaders ready for high-impact deployment.', icon: 'Users' },
    { title: 'Verified Requisitions', description: 'Companies are vetted for authenticity, ensuring every role you apply for is real and high-value.', icon: 'BadgeCheck' },
  ];

  const titleParts = title.split(" ");
  return (
    <section className="py-24 px-4 bg-muted/5 border-t border-primary/5 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-20 relative z-10">
        <div className="lg:w-1/3 space-y-8">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-micro px-6 py-2 rounded-full shadow-premium">
                Advantages
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {titleParts[0]} {titleParts[1]} <br /><span className="text-primary italic font-black">{titleParts.slice(2).join(" ")}</span>
            </h2>
            <p className="text-base text-muted-foreground font-normal leading-relaxed">
               {subtitle}
            </p>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-12">
            {features.map((feature: any, i: number) => {
                const Icon = ICON_MAP[feature.icon] || Briefcase;
                return (
                    <div key={feature.title} className="space-y-4 group">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SupportCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function SupportCard({ icon: Icon, title, description }: SupportCardProps) {
  return (
    <Card className="p-6 bg-card/20 border-primary/10 backdrop-blur-md hover:border-primary/50 transition-all cursor-pointer group hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </Card>
  );
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export type PricingPlan = {
  name: string
  description: string
  monthlyPrice: number | "Custom"
  yearlyPrice: number | "Custom"
  bestFor: string
  isPopular?: boolean
  features: string[]
  ctaText: string
  ctaLink: string
  ctaVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

interface PricingCardProps {
  plan: PricingPlan
  isYearly: boolean
}

export function PricingCard({ plan, isYearly }: PricingCardProps) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
  const isCustom = price === "Custom"

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative h-full ${plan.isPopular ? "z-10" : "z-0 mt-4 md:mt-8"}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
          <div className="bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest py-1 px-4 rounded-full flex items-center gap-1 shadow-lg shadow-primary/20">
            <Sparkles className="w-3 h-3" /> Most Popular
          </div>
        </div>
      )}

      <Card className={`h-full flex flex-col backdrop-blur-3xl bg-background/60 relative overflow-hidden transition-all duration-300 ${
        plan.isPopular 
          ? "border-primary/50 shadow-[0_0_40px_rgba(var(--primary),0.1)] ring-1 ring-primary/20" 
          : "border-border/50 hover:border-white/20"
      }`}>
        {/* Subtle background glow for popular plan */}
        {plan.isPopular && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        )}

        <CardHeader className="text-center pb-8 pt-8">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">{plan.name}</p>
          <div className="flex justify-center items-end gap-1 mb-4">
            {isCustom ? (
              <span className="text-4xl font-black font-heading tracking-tight">Custom</span>
            ) : (
              <>
                <span className="text-5xl font-black font-heading tracking-tighter">${(price as number) / 100}</span>
                <span className="text-muted-foreground font-medium mb-1">/mo</span>
              </>
            )}
          </div>
          <CardDescription className="text-base">{plan.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-xs font-bold mb-4 uppercase tracking-widest text-primary/80">Best for: {plan.bestFor}</p>
          <ul className="space-y-4">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-8 pb-8 mt-auto">
          <Link href={plan.ctaLink} className="w-full">
            <Button 
              variant={plan.ctaVariant || "default"} 
              className={`w-full h-12 font-bold text-base ${plan.isPopular ? "shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" : ""}`}
            >
              {plan.ctaText}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

"use client";

import React, { useState } from "react";
import { 
  Building2, Globe, CreditCard, ToggleRight, Database, 
  CheckCircle2, ArrowRight, ArrowLeft, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function CreateTenantWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const STEPS = [
    { id: 1, title: "Organization", icon: Building2 },
    { id: 2, title: "Plan & Region", icon: Globe },
    { id: 3, title: "Branding", icon: CreditCard },
    { id: 4, title: "Modules", icon: ToggleRight },
    { id: 5, title: "Limits", icon: Database },
    { id: 6, title: "Review", icon: CheckCircle2 },
  ];

  const handleNext = () => setStep(s => Math.min(6, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleProvision = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/platform/tenants/acme-corp-new");
    }, 2000);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Provision New Tenant</h1>
        <p className="text-muted-foreground text-sm">Follow the wizard to onboard a new organization into the Enterprise ecosystem.</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border/50 -z-10" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 -z-10" style={{ width: `${((step - 1) / 5) * 100}%` }} />
        
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
              step === s.id ? "border-primary bg-primary/10 text-primary" : 
              step > s.id ? "border-primary bg-primary text-primary-foreground" : 
              "border-border bg-card text-muted-foreground"
            }`}>
              <s.icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Wizard Content */}
      <Card className="border-border/50 shadow-sm min-h-[400px] flex flex-col">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle>{STEPS[step - 1].title}</CardTitle>
          <CardDescription>Step {step} of 6</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 flex-1">
          {step === 1 && (
            <div className="space-y-4 max-w-xl">
              <div className="grid gap-2">
                <Label>Organization Name</Label>
                <Input placeholder="e.g. Acme Corporation" />
              </div>
              <div className="grid gap-2">
                <Label>Tenant Slug</Label>
                <Input placeholder="e.g. acme-corp" />
                <p className="text-[10px] text-muted-foreground">This will be used for API routing: api.skillsutra.com/v1/acme-corp</p>
              </div>
              <div className="grid gap-2 mt-4">
                <Label>Primary Owner Email</Label>
                <Input type="email" placeholder="admin@acme.com" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 max-w-xl">
              <div className="grid gap-2">
                <Label>Subscription Tier</Label>
                <div className="grid grid-cols-3 gap-4">
                  {["Trial", "Pro", "Enterprise"].map(plan => (
                    <div key={plan} className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors ${plan === "Enterprise" ? "border-primary bg-primary/5" : "border-border"}`}>
                      <span className="font-bold">{plan}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Data Residency (Region)</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>US East (N. Virginia)</option>
                  <option>US West (Oregon)</option>
                  <option>EU (Frankfurt)</option>
                  <option>AP (Singapore)</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 max-w-xl">
              <div className="grid gap-2">
                <Label>Custom Domain</Label>
                <div className="flex gap-2">
                  <Input placeholder="careers" className="text-right" />
                  <div className="flex items-center px-3 bg-muted rounded-md text-sm border border-border">.skillsutra.com</div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Primary Brand Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#6366f1" className="w-12 h-10 p-1" />
                    <Input defaultValue="#6366f1" className="font-mono uppercase" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 max-w-2xl">
              {[
                { name: "ATS & Recruitment Engine", desc: "Full access to pipelines, requisitions, and parsing.", enabled: true },
                { name: "Core HRMS", desc: "Employee lifecycle, attendance, and directory.", enabled: true },
                { name: "CRM & Sales", desc: "Pipelines, contacts, and email sequencing.", enabled: false },
                { name: "Enterprise Projects", desc: "Sprint boards, wikis, and time tracking.", enabled: true },
                { name: "LMS & Learning", desc: "Course builder and skill certificates.", enabled: false },
              ].map((flag, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/10 transition-colors">
                  <div>
                    <h4 className="font-medium text-sm">{flag.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{flag.desc}</p>
                  </div>
                  <Switch defaultChecked={flag.enabled} />
                </div>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 max-w-xl">
              <div className="grid gap-2">
                <Label>Maximum Users (Seats)</Label>
                <Input type="number" defaultValue="100" />
              </div>
              <div className="grid gap-2">
                <Label>Storage Quota (GB)</Label>
                <Input type="number" defaultValue="500" />
              </div>
              <div className="grid gap-2">
                <Label>Monthly AI Tokens</Label>
                <Input type="number" defaultValue="1000000" />
                <p className="text-[10px] text-muted-foreground">Soft limit. Overages will be billed automatically.</p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 max-w-2xl">
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-600 mb-1">Ready for Provisioning</h3>
                  <p className="text-sm text-emerald-600/80 leading-relaxed">
                    The tenant configuration is valid. Clicking provision will create the database schema, setup isolated Redis namespaces, and email the owner their initial login payload.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-muted/20 p-6 rounded-xl border border-border/50">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">Acme Corporation</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">Enterprise</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">US East</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="font-medium">100</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 border-t border-border/50 flex justify-between bg-muted/10 rounded-b-xl">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1 || isSubmitting}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {step < 6 ? (
            <Button onClick={handleNext}>
              Next Step <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleProvision} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Provisioning Infrastructure...</>
              ) : (
                <><Database className="w-4 h-4 mr-2" /> Provision Tenant</>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

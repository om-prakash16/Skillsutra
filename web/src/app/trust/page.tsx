import React from "react";
import { ShieldCheck, Server, Lock, FileText, CheckCircle2, Download, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TrustCenter() {
  return (
    <div className="flex-1 bg-white min-h-screen">
      
      {/* Hero Header */}
      <div className="bg-slate-950 text-white py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-12 h-12 text-emerald-400" />
            <h1 className="text-4xl font-bold tracking-tight">SkillSutra Trust Center</h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl">
            Enterprise-grade security, compliance, and privacy. 
            We protect the hiring data of the world's most demanding organizations.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 md:px-8 space-y-12">
        
        {/* Compliance Badges */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
            <Lock className="w-6 h-6 text-indigo-600" /> Certifications & Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-emerald-100 bg-emerald-50/30 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600 font-bold text-lg border border-emerald-100">
                  SOC 2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">SOC-2 Type II</h3>
                  <p className="text-sm text-slate-500">Audited by Drata</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 bg-blue-50/30 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 font-bold text-lg border border-blue-100">
                  GDPR
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">GDPR Compliant</h3>
                  <p className="text-sm text-slate-500">EU Data Residency</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 bg-purple-50/30 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600 font-bold text-sm border border-purple-100 text-center leading-tight">
                  ISO<br/>27001
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">ISO 27001</h3>
                  <p className="text-sm text-slate-500">Information Security</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* System Uptime */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
            <Server className="w-6 h-6 text-indigo-600" /> Platform Uptime & Reliability
          </h2>
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-emerald-600">99.998%</h3>
                  <p className="text-sm text-slate-500">Uptime over the last 90 days</p>
                </div>
                <Button variant="outline" className="text-indigo-600 border-indigo-200">Subscribe to Updates</Button>
              </div>

              {/* Uptime bars (mock) */}
              <div className="flex gap-1 h-12 items-end">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm ${i === 42 ? 'bg-amber-400 h-8' : i === 75 ? 'bg-red-500 h-4' : 'bg-emerald-400 h-full'}`}
                    title={i === 42 ? 'Degraded Performance' : i === 75 ? 'Partial Outage' : '100% Uptime'}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                <span>90 days ago</span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Procurement Documents */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
            <FileText className="w-6 h-6 text-indigo-600" /> Procurement & Legal Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg flex justify-between items-center hover:bg-slate-50">
              <div>
                <p className="font-bold text-slate-900">Data Processing Agreement (DPA)</p>
                <p className="text-sm text-slate-500">Standard contractual clauses for EU data.</p>
              </div>
              <Button variant="ghost" size="icon"><Download className="w-5 h-5 text-indigo-600" /></Button>
            </div>
            <div className="p-4 border rounded-lg flex justify-between items-center hover:bg-slate-50">
              <div>
                <p className="font-bold text-slate-900">Sub-Processor List</p>
                <p className="text-sm text-slate-500">Register of vendors processing PII data.</p>
              </div>
              <Button variant="ghost" size="icon"><Download className="w-5 h-5 text-indigo-600" /></Button>
            </div>
            <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg flex justify-between items-center col-span-1 md:col-span-2">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-amber-900">Full SOC-2 Type II Audit Report</p>
                  <p className="text-sm text-amber-800">Requires a signed Non-Disclosure Agreement (NDA).</p>
                </div>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm whitespace-nowrap">Request Access</Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

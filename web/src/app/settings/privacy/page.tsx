"use client";

import React, { useState } from "react";
import { Shield, Download, Trash2, FileText, CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DataPrivacyPortal() {
  const [exportRequested, setExportRequested] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-4xl mx-auto bg-white min-h-screen">
      
      {/* Header */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="w-8 h-8 text-indigo-600" /> Privacy & Data Center
        </h1>
        <p className="text-muted-foreground mt-2">Manage your data, privacy settings, and compliance requests.</p>
      </div>

      <div className="space-y-6">
        
        {/* Data Export (GDPR) */}
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="bg-indigo-50/50 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" /> Download Your Data
            </h2>
            <p className="text-sm text-slate-600">
              Get a copy of all data associated with your SkillSutra account, including your profile, applications, and messages.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-slate-300" />
                <div>
                  <p className="font-medium">Account Data Archive</p>
                  <p className="text-xs text-muted-foreground">Format: JSON & PDF. Takes up to 24 hours.</p>
                </div>
              </div>
              <Button 
                onClick={() => setExportRequested(true)} 
                disabled={exportRequested}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {exportRequested ? "Processing Request..." : "Request Archive"}
              </Button>
            </div>
            {exportRequested && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-start gap-2 text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600" />
                <p>Your request has been queued. We will email you a secure download link within 24 hours.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Toggles */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-700" /> Consent & Tracking
            </h2>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Training Consent</p>
                <p className="text-sm text-muted-foreground">Allow SkillSutra to use your anonymized resume to train our matching models.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 cursor-pointer">
                <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Communications</p>
                <p className="text-sm text-muted-foreground">Receive emails about new features, hackathons, and promotions.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-pointer">
                <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 shadow-sm">
          <CardHeader className="bg-red-50/50 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-red-700">
              <Trash2 className="w-5 h-5" /> Danger Zone
            </h2>
            <p className="text-sm text-red-600">
              Permanently delete your account and all associated data.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-bold mb-1">Before you delete your account:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Your account will be placed into a 30-day "soft delete" grace period.</li>
                  <li>You will not be able to log in or apply to jobs during this time.</li>
                  <li>After 30 days, your data will be permanently and irreversibly eradicated from our servers.</li>
                </ul>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => setDeleteRequested(true)}
              disabled={deleteRequested}
              className="bg-red-600 hover:bg-red-700 font-bold"
            >
              {deleteRequested ? "Deletion Scheduled" : "Schedule Account Deletion"}
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

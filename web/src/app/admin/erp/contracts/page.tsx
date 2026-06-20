"use client";

import React, { useState } from "react";
import { 
  FileSignature, Search, Filter, Plus, Clock, 
  AlertTriangle, CheckCircle2, ChevronRight, Download, Eye, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockContracts = [
  { id: "CTR-AWS-2025", title: "AWS Enterprise Agreement", vendor: "Amazon Web Services", type: "Service Level Agreement", value: "$850,000/yr", startDate: "Jan 1, 2025", endDate: "Dec 31, 2026", status: "Expiring Soon", daysLeft: 45 },
  { id: "CTR-SF-2024", title: "Salesforce CRM License", vendor: "Salesforce", type: "Software License", value: "$120,000/yr", startDate: "Mar 1, 2024", endDate: "Feb 28, 2027", status: "Active", daysLeft: 142 },
  { id: "CTR-WW-2023", title: "SF Office Lease Agreement", vendor: "WeWork", type: "Real Estate", value: "$182,400/yr", startDate: "Nov 1, 2023", endDate: "Oct 31, 2026", status: "In Renewal", daysLeft: 12 },
  { id: "CTR-MKT-2026", title: "Q4 Marketing Retainer", vendor: "Global Marketing Agency", type: "Vendor Contract", value: "$45,000", startDate: "Oct 1, 2026", endDate: "Dec 31, 2026", status: "Pending Signature", daysLeft: 73 },
];

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContracts = mockContracts.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract Management</h1>
          <p className="text-muted-foreground mt-1">Track NDAs, SLAs, vendor agreements, and renewal timelines.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Templates</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Upload Contract</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-primary" /> Total Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">Legally binding contracts</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card border-l-4 border-l-rose-500 hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Expiring &lt; 90 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1 text-rose-500 font-medium">Action required</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Pending Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting legal approval</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Annual Contract Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1.15M</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">Across all active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                className="pl-9 h-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="p-4 border border-border/50 rounded-xl bg-card hover:border-primary/40 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6 group">
                
                <div className="flex items-center gap-4 min-w-[250px]">
                  <div className={`p-3 rounded-xl border flex items-center justify-center ${
                    contract.status === 'Expiring Soon' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                    contract.status === 'In Renewal' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    contract.status === 'Pending Signature' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                    {contract.status === 'Expiring Soon' ? <AlertTriangle className="w-5 h-5" /> : 
                     contract.status === 'Pending Signature' ? <Clock className="w-5 h-5" /> :
                     <FileSignature className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{contract.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                       <span className="font-mono">{contract.id}</span> • {contract.vendor}
                    </p>
                  </div>
                </div>

                <div className="flex-1 w-full flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contract Type & Value</p>
                    <p className="text-sm font-medium">{contract.type}</p>
                    <p className="text-xs font-mono mt-0.5 text-muted-foreground">{contract.value}</p>
                  </div>
                  
                  <div className="hidden lg:block w-48">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{contract.startDate}</span>
                      <span className={contract.daysLeft < 60 ? "text-rose-500 font-medium" : "text-muted-foreground"}>{contract.endDate}</span>
                    </div>
                    <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${
                          contract.daysLeft < 60 ? "bg-rose-500" :
                          contract.status === "Pending Signature" ? "bg-blue-500" :
                          "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.max(10, 100 - (contract.daysLeft / 365 * 100))}%` }}
                      />
                    </div>
                    <p className={`text-[10px] mt-1 text-right font-medium ${contract.daysLeft < 60 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                      {contract.daysLeft} days left
                    </p>
                  </div>

                  <div className="min-w-[120px] text-right">
                    <Badge variant="outline" className={
                      contract.status === "Expiring Soon" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                      contract.status === "In Renewal" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      contract.status === "Pending Signature" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    }>
                      {contract.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Download className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><ChevronRight className="w-4 h-4" /></Button>
                </div>

              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

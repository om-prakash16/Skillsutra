"use client";

import React, { useState } from "react";
import { 
  Building2, Search, Filter, Plus, MoreHorizontal, Download, 
  Upload, SlidersHorizontal, ShieldCheck, Activity, Globe, 
  Database, Users, Cpu, Ban, Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const mockTenants = [
  { id: "T-8492", slug: "acme-corp", name: "Acme Corporation", plan: "Enterprise", status: "Active", users: "1,420", storage: "420 GB", region: "us-east-1", created: "2024-01-15", ai: "4.2M" },
  { id: "T-8491", slug: "globex", name: "Globex Inc", plan: "Pro", status: "Active", users: "85", storage: "45 GB", region: "eu-west-1", created: "2024-02-28", ai: "120K" },
  { id: "T-8490", slug: "soylent", name: "Soylent Corp", plan: "Trial", status: "Suspended", users: "12", storage: "5 GB", region: "us-west-2", created: "2024-05-10", ai: "5K" },
  { id: "T-8489", slug: "initech", name: "Initech", plan: "Enterprise", status: "Active", users: "3,100", storage: "1.2 TB", region: "ap-southeast-1", created: "2023-11-05", ai: "12.4M" },
  { id: "T-8488", slug: "umbrellacorp", name: "Umbrella Corp", plan: "Starter", status: "Archived", users: "4", storage: "2 GB", region: "us-east-1", created: "2023-08-14", ai: "0" },
];

export default function TenantListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Tenant Control Center</h1>
          </div>
          <p className="text-muted-foreground text-sm">Provision, monitor, and configure SaaS organizations (Tenants).</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Import</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Link href="/admin/platform/tenants/create">
            <Button><Plus className="w-4 h-4 mr-2" /> Provision Tenant</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Total Tenants</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,420</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise Tier</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">45</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500" /> Trialing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">156</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center justify-between">
              <span className="flex items-center gap-2"><Ban className="w-4 h-4 text-rose-500" /> Suspended</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-500">14</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tenants by name, slug, or ID..." className="pl-9 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
              <Button variant="outline" size="sm" className="h-9"><SlidersHorizontal className="w-4 h-4 mr-2" /> Columns</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Storage / AI</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTenants.map((tenant) => (
                <TableRow key={tenant.id} className="group hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {tenant.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link href={`/admin/platform/tenants/${tenant.slug}`} className="font-semibold text-sm hover:underline">
                          {tenant.name}
                        </Link>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{tenant.slug} • {tenant.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      tenant.plan === "Enterprise" ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" :
                      tenant.plan === "Pro" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      "bg-muted text-muted-foreground"
                    }>
                      {tenant.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      tenant.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      tenant.status === "Suspended" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                      "bg-muted text-muted-foreground"
                    }>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" /> {tenant.users}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Database className="w-3 h-3" /> {tenant.storage}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Cpu className="w-3 h-3" /> {tenant.ai} tokens
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                      <Globe className="w-3 h-3" /> {tenant.region}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/platform/tenants/${tenant.slug}`}>View Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Impersonate Owner</DropdownMenuItem>
                        <DropdownMenuItem>View Audit Logs</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600"><Power className="w-4 h-4 mr-2" /> Suspend Tenant</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
          <span>Showing 1-5 of 1,420 tenants</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" disabled>Prev</Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

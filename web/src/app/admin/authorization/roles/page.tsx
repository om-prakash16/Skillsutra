"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, Search, Filter, Plus, MoreHorizontal, Globe, 
  Building2, SplitSquareHorizontal, CheckCircle2, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const mockRoles = [
  { id: "R-101", name: "Super Admin", level: "Platform", description: "Unrestricted access to all platform and tenant resources.", users: 5, policies: 42, system: true },
  { id: "R-102", name: "Tenant Admin", level: "Tenant", description: "Full control over a specific tenant organization.", users: 1420, policies: 28, system: true },
  { id: "R-103", name: "HR Manager", level: "Tenant", description: "Access to HRMS, ATS pipelines, and employee data.", users: 3400, policies: 15, system: false },
  { id: "R-104", name: "Project Owner", level: "Workspace", description: "Controls specific project boards and workspace members.", users: 12500, policies: 8, system: false },
  { id: "R-105", name: "Finance Admin", level: "Platform", description: "Global access to billing, invoicing, and subscriptions.", users: 12, policies: 12, system: true },
];

export default function RolesListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Platform": return <Globe className="w-3.5 h-3.5 text-indigo-500" />;
      case "Tenant": return <Building2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "Workspace": return <SplitSquareHorizontal className="w-3.5 h-3.5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Global Roles</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">177 Roles</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Define and manage hierarchical RBAC roles across the Platform, Tenant, and Workspace tiers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button><Plus className="w-4 h-4 mr-2" /> Create Custom Role</Button>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search roles by name, ID, or description..." className="pl-9 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Tier Filters</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>ABAC Policies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRoles.map((role) => (
                <TableRow key={role.id} className="group hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <Link href={`/admin/authorization/roles/${role.id}`} className="font-semibold text-sm hover:underline flex items-center gap-2">
                          {role.name}
                          {role.system && <Badge variant="outline" className="text-[9px] px-1 h-4 bg-muted/50 border-border"><Lock className="w-2.5 h-2.5 mr-1"/> System</Badge>}
                        </Link>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{role.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs font-medium">
                      {getLevelIcon(role.level)} {role.level}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground truncate max-w-[300px] block">{role.description}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{role.users.toLocaleString()}</span> <span className="text-xs text-muted-foreground">users</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-sm">{role.policies}</span>
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
                        <DropdownMenuLabel>Role Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/authorization/roles/${role.id}`}>Edit Permission Matrix</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Clone Role</DropdownMenuItem>
                        <DropdownMenuItem>View Assigned Users</DropdownMenuItem>
                        {!role.system && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-rose-600">Delete Role</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

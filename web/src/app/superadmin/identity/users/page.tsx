"use client";

import React, { useState } from "react";
import { 
  Search, Filter, SlidersHorizontal, MoreHorizontal, Download, 
  Upload, ShieldAlert, Fingerprint, Mail, Phone, Lock, 
  CheckCircle2, Ban, Trash, MonitorSmartphone, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockUsers = [
  { id: "U-849201", username: "jane.doe", name: "Jane Doe", email: "jane.doe@acme.com", status: "Active", role: "Tenant Admin", mfa: true, provider: "Email", created: "2024-01-15", lastLogin: "2 mins ago", orgs: 2 },
  { id: "U-849202", username: "john.smith", name: "John Smith", email: "jsmith@globex.io", status: "Pending", role: "Employee", mfa: false, provider: "Google", created: "2024-02-28", lastLogin: "Never", orgs: 1 },
  { id: "U-849203", username: "alice.w", name: "Alice Wong", email: "alice@soylent.co", status: "Suspended", role: "Manager", mfa: true, provider: "Microsoft", created: "2024-05-10", lastLogin: "3 days ago", orgs: 1 },
  { id: "U-849204", username: "bob.b", name: "Bob Builder", email: "bob@initech.com", status: "Active", role: "Platform Admin", mfa: true, provider: "Email", created: "2023-11-05", lastLogin: "Just now", orgs: 12 },
  { id: "U-849205", username: "charlie.d", name: "Charlie Davis", email: "cdavis@umbrellacorp.net", status: "Blocked", role: "Guest", mfa: false, provider: "GitHub", created: "2023-08-14", lastLogin: "2 weeks ago", orgs: 4 },
];

export default function IdentityUsersListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Global Users</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">1,420,105 Total</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Centrally manage user identities, access, and security across the entire ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Import</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button><Mail className="w-4 h-4 mr-2" /> Invite User</Button>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search global users by name, email, or ID..." className="pl-9 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Advanced Filters</Button>
              <Button variant="outline" size="sm" className="h-9"><SlidersHorizontal className="w-4 h-4 mr-2" /> Columns</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Identity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Security / Auth</TableHead>
                <TableHead>Role & Orgs</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="group hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border/50">
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/admin/identity/users/${user.id}`} className="font-semibold text-sm hover:underline flex items-center gap-2">
                          {user.name}
                        </Link>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      user.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      user.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      user.status === "Suspended" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                      "bg-muted text-muted-foreground"
                    }>
                      {user.status === "Active" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {user.status === "Blocked" && <Ban className="w-3 h-3 mr-1" />}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        {user.mfa ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-normal px-1.5 py-0.5 text-[10px]"><Lock className="w-3 h-3 mr-1" /> MFA Active</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 font-normal px-1.5 py-0.5 text-[10px]"><ShieldAlert className="w-3 h-3 mr-1" /> No MFA</Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Key className="w-3 h-3" /> {user.provider}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{user.role}</span>
                      <span className="text-xs text-muted-foreground">{user.orgs} Organizations</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs">{user.lastLogin}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{user.id}</span>
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
                        <DropdownMenuLabel>Identity Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/identity/users/${user.id}`}>Inspect Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-indigo-600"><Fingerprint className="w-4 h-4 mr-2" /> Impersonate</DropdownMenuItem>
                        <DropdownMenuItem>Require Password Reset</DropdownMenuItem>
                        <DropdownMenuItem>Revoke All Sessions</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600"><Ban className="w-4 h-4 mr-2" /> Suspend Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
          <span>Showing 1-5 of 1,420,105 users</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" disabled>Prev</Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

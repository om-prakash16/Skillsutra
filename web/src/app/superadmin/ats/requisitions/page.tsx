"use client";

import React, { useState } from "react";
import { 
  ClipboardList, Plus, Search, Filter, Building2, UserPlus, FileSpreadsheet, 
  CheckCircle2, Clock, AlertTriangle, Briefcase, ArrowRight, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockRequisitions = [
  { id: "REQ-2026-042", title: "Senior Frontend Engineer", department: "Engineering", hiringManager: "Sarah Jenkins", budget: "$150,000 - $180,000", targetDate: "Nov 15, 2026", status: "Open", applicants: 45, initial: "SJ" },
  { id: "REQ-2026-043", title: "Product Marketing Manager", department: "Marketing", hiringManager: "Anita Desai", budget: "$120,000 - $140,000", targetDate: "Dec 01, 2026", status: "Pending Finance", applicants: 0, initial: "AD" },
  { id: "REQ-2026-044", title: "UX Designer", department: "Design", hiringManager: "Michael Chang", budget: "$110,000 - $130,000", targetDate: "Oct 30, 2026", status: "Approved", applicants: 0, initial: "MC" },
  { id: "REQ-2026-045", title: "Account Executive", department: "Sales", hiringManager: "David Foster", budget: "$90,000 + Comm", targetDate: "Oct 25, 2026", status: "Filled", applicants: 120, initial: "DF" },
  { id: "REQ-2026-046", title: "Backend Developer", department: "Engineering", hiringManager: "Sarah Jenkins", budget: "$140,000 - $160,000", targetDate: "Nov 30, 2026", status: "Draft", applicants: 0, initial: "SJ" },
];

export default function RequisitionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequisitions = mockRequisitions.filter(req => 
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Requisitions</h1>
          <p className="text-muted-foreground mt-1">Manage headcount approvals, budgets, and hiring workflows.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileSpreadsheet className="w-4 h-4 mr-2" /> Export</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> New Requisition</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Active Reqs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">8</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Awaiting Finance / HR
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Approved (Unpublished)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">5</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowRight className="w-3 h-3 mr-1" /> Ready for ATS Posting
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Filled (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">12</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requisitions..."
              className="pl-9 bg-muted/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Req ID</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>Hiring Manager</TableHead>
                <TableHead>Budget Range</TableHead>
                <TableHead>Target Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequisitions.map((req) => (
                <TableRow key={req.id} className="group">
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                    {req.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors cursor-pointer">{req.title}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Building2 className="w-3 h-3 mr-1" /> {req.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{req.initial}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{req.hiringManager}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {req.budget}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {req.targetDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      req.status === "Open" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      req.status === "Approved" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      req.status === "Pending Finance" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      req.status === "Filled" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                      "bg-muted text-muted-foreground border-border"
                    }>
                      {req.status === "Pending Finance" && <Clock className="w-3 h-3 mr-1" />}
                      {req.status === "Approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {req.status === "Open" && <Briefcase className="w-3 h-3 mr-1" />}
                      {req.status === "Filled" && <UserPlus className="w-3 h-3 mr-1" />}
                      {req.status === "Draft" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "Approved" ? (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Post Job</Button>
                    ) : req.status === "Pending Finance" ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-500/10">Approve</Button>
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-500/10">Reject</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">Manage</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequisitions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No requisitions found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

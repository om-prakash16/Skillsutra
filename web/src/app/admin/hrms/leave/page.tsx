"use client";

import React, { useState } from "react";
import { 
  CalendarOff, CheckCircle2, Clock, XCircle, Filter, Plus, Calendar, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const leaveRequests = [
  { id: "LR-101", employee: "Sarah Jenkins", type: "Annual Leave", dates: "Oct 15 - Oct 20 (5 days)", status: "Pending", appliedOn: "Oct 01, 2026", initial: "SJ" },
  { id: "LR-102", employee: "Michael Chang", type: "Sick Leave", dates: "Oct 05 (1 day)", status: "Approved", appliedOn: "Oct 05, 2026", initial: "MC" },
  { id: "LR-103", employee: "Emma Wilson", type: "Paternity Leave", dates: "Nov 01 - Nov 30 (30 days)", status: "Pending", appliedOn: "Sep 28, 2026", initial: "EW" },
  { id: "LR-104", employee: "David Foster", type: "Casual Leave", dates: "Oct 12 (1 day)", status: "Rejected", appliedOn: "Oct 02, 2026", initial: "DF" },
];

export default function LeaveCenterPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Center</h1>
          <p className="text-muted-foreground mt-1">Manage employee time off, balances, and approval workflows.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> Team Calendar</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Apply Leave</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">12</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> 3 require urgent action
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">On Leave Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">8</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Upcoming Leaves (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Leave Taken (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42 <span className="text-lg font-normal text-muted-foreground">days</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Review and manage pending time off</CardDescription>
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{req.initial}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{req.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarOff className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                      {req.type}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{req.dates}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{req.appliedOn}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      req.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      req.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }>
                      {req.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                      {req.status === "Approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {req.status === "Rejected" && <XCircle className="w-3 h-3 mr-1" />}
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-500/10">Approve</Button>
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-500/10">Reject</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">Details</Button>
                    )}
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

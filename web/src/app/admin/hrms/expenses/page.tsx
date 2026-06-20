"use client";

import React from "react";
import { Receipt, DollarSign, Plane, Coffee, Briefcase, Plus, Filter, Upload, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockExpenses = [
  { id: "EXP-2026-001", employee: "Sarah Jenkins", amount: "$1,250.00", category: "Travel", date: "Oct 12, 2026", status: "Pending", initial: "SJ" },
  { id: "EXP-2026-002", employee: "Michael Chang", amount: "$45.50", category: "Meals", date: "Oct 10, 2026", status: "Approved", initial: "MC" },
  { id: "EXP-2026-003", employee: "David Foster", amount: "$850.00", category: "Equipment", date: "Oct 05, 2026", status: "Paid", initial: "DF" },
  { id: "EXP-2026-004", employee: "Emma Wilson", amount: "$120.00", category: "Training", date: "Oct 01, 2026", status: "Rejected", initial: "EW" },
  { id: "EXP-2026-005", employee: "James Rodriguez", amount: "$320.00", category: "Travel", date: "Sep 28, 2026", status: "Paid", initial: "JR" },
];

export default function ExpensesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
          <p className="text-muted-foreground mt-1">Review, approve, and reimburse employee expenses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button><Upload className="w-4 h-4 mr-2" /> Upload Receipt</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">$4,250</div>
            <p className="text-xs text-muted-foreground mt-1">12 requests waiting</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Approved (Unpaid)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">$1,840</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for payroll integration</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Paid (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">$12,450</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              Travel
            </div>
            <p className="text-xs text-muted-foreground mt-1">45% of total expenses</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Expense Reports</CardTitle>
          <CardDescription>Manage incoming reimbursement requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                    {expense.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {expense.initial}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{expense.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {expense.category === "Travel" ? <Plane className="w-3.5 h-3.5" /> : 
                       expense.category === "Meals" ? <Coffee className="w-3.5 h-3.5" /> :
                       <Briefcase className="w-3.5 h-3.5" />}
                      {expense.category}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-sm">
                    {expense.amount}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {expense.date}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      expense.status === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      expense.status === "Approved" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      expense.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }>
                      {expense.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                      {expense.status === "Approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {expense.status === "Paid" && <DollarSign className="w-3 h-3 mr-1" />}
                      {expense.status === "Rejected" && <XCircle className="w-3 h-3 mr-1" />}
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {expense.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-500/10">Approve</Button>
                        <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-500/10">Reject</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">View Receipt</Button>
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

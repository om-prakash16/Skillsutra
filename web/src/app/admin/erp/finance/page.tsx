"use client";

import React, { useState } from "react";
import { 
  Landmark, Search, Filter, Plus, FileText, Download, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockJournalEntries = [
  { id: "JE-2026-1042", date: "Oct 18, 2026", description: "Monthly AWS Hosting", account: "Software & Cloud (5100)", amount: "$12,450.00", type: "Debit", status: "Posted" },
  { id: "JE-2026-1043", date: "Oct 18, 2026", description: "Monthly AWS Hosting", account: "Accounts Payable (2100)", amount: "$12,450.00", type: "Credit", status: "Posted" },
  { id: "JE-2026-1044", date: "Oct 15, 2026", description: "Q3 Client Invoice - Acme Corp", account: "Accounts Receivable (1200)", amount: "$45,000.00", type: "Debit", status: "Posted" },
  { id: "JE-2026-1045", date: "Oct 15, 2026", description: "Q3 Client Invoice - Acme Corp", account: "Services Revenue (4100)", amount: "$45,000.00", type: "Credit", status: "Posted" },
  { id: "JE-2026-1046", date: "Oct 14, 2026", description: "Employee Payroll (Oct 1-15)", account: "Payroll Expense (6100)", amount: "$184,200.00", type: "Debit", status: "Pending Approval" },
];

const mockAccounts = [
  { code: "1000", name: "Cash & Cash Equivalents", type: "Asset", balance: "$1,245,600.00" },
  { code: "1200", name: "Accounts Receivable", type: "Asset", balance: "$450,200.00" },
  { code: "2100", name: "Accounts Payable", type: "Liability", balance: "$125,400.00" },
  { code: "3000", name: "Retained Earnings", type: "Equity", balance: "$850,000.00" },
  { code: "4100", name: "Services Revenue", type: "Revenue", balance: "$2,450,000.00" },
  { code: "5100", name: "Software & Cloud", type: "Expense", balance: "$145,000.00" },
  { code: "6100", name: "Payroll Expense", type: "Expense", balance: "$1,450,000.00" },
];

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance & Accounting</h1>
          <p className="text-muted-foreground mt-1">Manage the General Ledger, Journal Entries, and Chart of Accounts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Trial Balance</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> New Journal Entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1.69M</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> Cash + AR
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$125.4K</div>
            <p className="text-xs text-muted-foreground mt-1 text-rose-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> Accounts Payable
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Equity & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$3.30M</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
              <ArrowUpRight className="w-3 h-3 mr-1" /> YTD
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 border border-border/50 p-1">
            <TabsTrigger value="journal" className="rounded-md px-4"><FileText className="w-4 h-4 mr-2" /> Journal Entries</TabsTrigger>
            <TabsTrigger value="accounts" className="rounded-md px-4"><Landmark className="w-4 h-4 mr-2" /> Chart of Accounts</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 h-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          </div>
        </div>

        <TabsContent value="journal" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Entry ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Debit / Credit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockJournalEntries.map((entry, i) => (
                    <TableRow key={i} className="group hover:bg-muted/20">
                      <TableCell className="font-mono text-xs text-muted-foreground">{entry.id}</TableCell>
                      <TableCell className="text-sm">{entry.date}</TableCell>
                      <TableCell className="font-medium text-sm">{entry.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.account}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={entry.type === 'Debit' ? 'text-emerald-500' : 'text-rose-500'}>
                          {entry.type === 'Debit' ? '+' : '-'}{entry.amount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          entry.status === "Posted" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                          "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }>
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Current Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAccounts.map((account) => (
                    <TableRow key={account.code} className="group hover:bg-muted/20">
                      <TableCell className="font-mono text-sm font-medium">{account.code}</TableCell>
                      <TableCell className="font-medium text-sm">{account.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal text-xs">{account.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium">{account.balance}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

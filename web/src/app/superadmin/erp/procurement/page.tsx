"use client";

import React, { useState } from "react";
import { 
  ShoppingCart, Search, Filter, Plus, FileText, Building2,
  AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, MoreHorizontal, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockPOs = [
  { id: "PO-2026-0891", vendor: "Apple Inc.", description: "10x MacBook Pro M3 (Engineering)", amount: "$24,500.00", date: "Oct 15, 2026", status: "Approved" },
  { id: "PO-2026-0892", vendor: "AWS", description: "Q4 Cloud Infrastructure Commit", amount: "$85,000.00", date: "Oct 14, 2026", status: "Pending Manager Approval" },
  { id: "PO-2026-0893", vendor: "Salesforce", description: "Annual CRM License Renewal", amount: "$120,000.00", date: "Oct 12, 2026", status: "Paid" },
  { id: "PO-2026-0894", vendor: "WeWork", description: "SF Office Lease (Nov)", amount: "$15,200.00", date: "Oct 10, 2026", status: "Processing" },
  { id: "PO-2026-0895", vendor: "Stripe", description: "Payment Gateway Integration Fees", amount: "$2,450.00", date: "Oct 08, 2026", status: "Paid" },
];

const mockVendors = [
  { id: "VND-101", name: "Apple Inc.", category: "Hardware", risk: "Low", status: "Active", spend: "$145,200" },
  { id: "VND-102", name: "Amazon Web Services", category: "Infrastructure", risk: "Low", status: "Active", spend: "$850,000" },
  { id: "VND-103", name: "Salesforce", category: "Software", risk: "Low", status: "Active", spend: "$120,000" },
  { id: "VND-104", name: "DataBricks", category: "Infrastructure", risk: "Medium", status: "Under Review", spend: "$45,000" },
  { id: "VND-105", name: "Global Marketing Agency", category: "Services", risk: "High", status: "Inactive", spend: "$0" },
];

export default function ProcurementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement & Vendors</h1>
          <p className="text-muted-foreground mt-1">Manage purchase orders, vendor risk, and operational spend.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Building2 className="w-4 h-4 mr-2" /> Invite Vendor</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create PO</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" /> Pending POs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Requires approval</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" /> MTD Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$246.5K</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500 font-medium">
              Within budget
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" /> Active Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 3 onboarded this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card border-l-4 border-l-rose-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Vendor Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1 text-rose-500 font-medium">
              High risk identified
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pos" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 border border-border/50 p-1">
            <TabsTrigger value="pos" className="rounded-md px-4"><ShoppingCart className="w-4 h-4 mr-2" /> Purchase Orders</TabsTrigger>
            <TabsTrigger value="vendors" className="rounded-md px-4"><Building2 className="w-4 h-4 mr-2" /> Vendor Directory</TabsTrigger>
            <TabsTrigger value="approvals" className="rounded-md px-4"><CheckCircle2 className="w-4 h-4 mr-2" /> Pending Approvals</TabsTrigger>
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

        <TabsContent value="pos" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPOs.map((po, i) => (
                    <TableRow key={i} className="group hover:bg-muted/20 cursor-pointer">
                      <TableCell className="font-mono text-sm font-medium">{po.id}</TableCell>
                      <TableCell className="font-medium text-sm flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{po.vendor.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {po.vendor}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{po.description}</TableCell>
                      <TableCell className="text-sm">{po.date}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium">{po.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          po.status === "Approved" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                          po.status === "Paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }>
                          {po.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Vendor ID</TableHead>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>YTD Spend</TableHead>
                    <TableHead>Risk Profile</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVendors.map((vendor, i) => (
                    <TableRow key={i} className="group hover:bg-muted/20">
                      <TableCell className="font-mono text-sm text-muted-foreground">{vendor.id}</TableCell>
                      <TableCell className="font-medium text-sm flex items-center gap-2">
                        <Avatar className="h-6 w-6 border-2 border-background shadow-sm">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{vendor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {vendor.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{vendor.category}</TableCell>
                      <TableCell className="font-mono text-sm font-medium">{vendor.spend}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {vendor.risk === "Low" ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : 
                           vendor.risk === "Medium" ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : 
                           <AlertTriangle className="w-4 h-4 text-rose-500" />}
                          <span className={vendor.risk === "Low" ? "text-emerald-500" : vendor.risk === "Medium" ? "text-amber-500" : "text-rose-500"}>
                            {vendor.risk}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          vendor.status === "Active" ? "bg-emerald-500/10 text-emerald-600" :
                          vendor.status === "Under Review" ? "bg-amber-500/10 text-amber-600" :
                          "bg-muted text-muted-foreground"
                        }>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Button>
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

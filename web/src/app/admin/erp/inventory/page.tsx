"use client";

import React, { useState } from "react";
import { 
  Package, Search, Filter, Plus, Box, 
  AlertTriangle, Laptop, MonitorSmartphone, Server, MoreHorizontal, ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockInventory = [
  { id: "SKU-101", name: "MacBook Pro M3 16\"", category: "Hardware", qty: 24, location: "SF Warehouse", minStock: 10, status: "In Stock" },
  { id: "SKU-102", name: "MacBook Pro M3 14\"", category: "Hardware", qty: 2, location: "NY Office", minStock: 5, status: "Low Stock" },
  { id: "SKU-205", name: "Dell UltraSharp 27\"", category: "Peripherals", qty: 45, location: "SF Warehouse", minStock: 15, status: "In Stock" },
  { id: "SKU-882", name: "Herman Miller Aeron", category: "Furniture", qty: 0, location: "London Office", minStock: 2, status: "Out of Stock" },
  { id: "SKU-301", name: "Cisco Meraki MR46", category: "Networking", qty: 12, location: "Data Center A", minStock: 10, status: "In Stock" },
];

const mockAssets = [
  { tag: "AST-2024-001", name: "MacBook Pro M2", assignedTo: "Sarah Jenkins", department: "Engineering", purchaseDate: "Jan 12, 2024", value: "$2,400.00", status: "Assigned" },
  { tag: "AST-2024-002", name: "MacBook Pro M2", assignedTo: "Michael Chang", department: "Design", purchaseDate: "Jan 12, 2024", value: "$2,400.00", status: "Assigned" },
  { tag: "AST-2025-142", name: "Dell UltraSharp 27\"", assignedTo: "Unassigned", department: "IT Storage", purchaseDate: "Mar 05, 2025", value: "$650.00", status: "Available" },
  { tag: "AST-2023-881", name: "Lenovo ThinkPad X1", assignedTo: "David Foster", department: "Engineering", purchaseDate: "Nov 20, 2023", value: "$1,800.00", status: "Maintenance" },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory & Assets</h1>
          <p className="text-muted-foreground mt-1">Manage physical hardware, office inventory, and employee asset allocation.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><ArrowUpDown className="w-4 h-4 mr-2" /> Stock Transfer</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Add Inventory</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Box className="w-4 h-4 text-primary" /> Total SKUs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground mt-1">Across 4 locations</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm bg-card border-l-4 border-l-rose-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1 text-rose-500 font-medium">Require immediate PO</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-500" /> Tracked Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">842</div>
            <p className="text-xs text-muted-foreground mt-1">790 Assigned to Employees</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-500" /> Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">Current depreciated value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted/50 border border-border/50 p-1">
            <TabsTrigger value="inventory" className="rounded-md px-4"><Package className="w-4 h-4 mr-2" /> Warehouse Inventory</TabsTrigger>
            <TabsTrigger value="assets" className="rounded-md px-4"><MonitorSmartphone className="w-4 h-4 mr-2" /> Assigned Assets</TabsTrigger>
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

        <TabsContent value="inventory" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInventory.map((item, i) => (
                    <TableRow key={i} className="group hover:bg-muted/20">
                      <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                      <TableCell className="font-medium text-sm flex items-center gap-2">
                        {item.category === "Hardware" ? <Laptop className="w-4 h-4 text-blue-500" /> : 
                         item.category === "Peripherals" ? <MonitorSmartphone className="w-4 h-4 text-emerald-500" /> :
                         <Box className="w-4 h-4 text-amber-500" />}
                        {item.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                      <TableCell className="text-sm">{item.location}</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-mono font-medium ${item.qty <= item.minStock ? 'text-rose-500' : ''}`}>
                          {item.qty}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">/ {item.minStock} min</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          item.status === "In Stock" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          item.status === "Low Stock" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                          "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="mt-0">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Asset Tag</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAssets.map((asset, i) => (
                    <TableRow key={i} className="group hover:bg-muted/20">
                      <TableCell className="font-mono text-xs font-medium">{asset.tag}</TableCell>
                      <TableCell className="font-medium text-sm">{asset.name}</TableCell>
                      <TableCell className={asset.assignedTo === "Unassigned" ? "text-muted-foreground italic text-sm" : "text-sm"}>
                        {asset.assignedTo}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{asset.department}</TableCell>
                      <TableCell className="font-mono text-sm">{asset.value}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          asset.status === "Assigned" ? "bg-blue-500/10 text-blue-600" :
                          asset.status === "Available" ? "bg-emerald-500/10 text-emerald-600" :
                          "bg-amber-500/10 text-amber-600"
                        }>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
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

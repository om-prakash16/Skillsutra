"use client";

import React, { useState } from "react";
import { 
  FileText, Search, Filter, Plus, MoreHorizontal, Globe, 
  CheckCircle2, Clock, Bot, MousePointerClick
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const mockPages = [
  { id: "P-101", title: "Enterprise Landing Page", slug: "/", type: "Landing Page", author: "Jane Doe", status: "Published", seo: 98, updated: "2 hrs ago" },
  { id: "P-102", title: "About Us (2024 Redesign)", slug: "/about", type: "Standard Page", author: "John Smith", status: "Draft", seo: 75, updated: "1 day ago" },
  { id: "P-103", title: "Pricing & Plans", slug: "/pricing", type: "Pricing Page", author: "Jane Doe", status: "Published", seo: 92, updated: "5 days ago" },
  { id: "P-104", title: "Black Friday Promo", slug: "/promo/bf24", type: "Campaign", author: "Marketing Team", status: "Scheduled", seo: 88, updated: "Just now" },
  { id: "P-105", title: "Contact Sales", slug: "/contact", type: "Form Page", author: "System", status: "Published", seo: 100, updated: "1 month ago" },
];

export default function CMSPagesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Published</Badge>;
      case "Draft": return <Badge variant="outline" className="bg-muted text-muted-foreground border-border"><FileText className="w-3 h-3 mr-1" /> Draft</Badge>;
      case "Scheduled": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Scheduled</Badge>;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">1,248 Total</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Manage all static and dynamic pages across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-indigo-600 border-indigo-500/30 hover:bg-indigo-500/10">
            <Bot className="w-4 h-4 mr-2" /> AI Content Generate
          </Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create Page</Button>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search pages by title or slug..." className="pl-9 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Page Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>SEO Score</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPages.map((page) => (
                <TableRow key={page.id} className="group hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm hover:underline cursor-pointer flex items-center gap-2">
                          {page.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1"><Globe className="w-3 h-3" /> {page.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(page.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{page.type}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${page.seo >= 90 ? 'bg-emerald-500' : page.seo >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                          style={{ width: `${page.seo}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">{page.seo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <span className="font-medium block">{page.updated}</span>
                      <span className="text-muted-foreground">by {page.author}</span>
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
                        <DropdownMenuLabel>Page Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/cms/builder"><MousePointerClick className="w-4 h-4 mr-2"/> Open in Visual Builder</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Settings & SEO</DropdownMenuItem>
                        <DropdownMenuItem>View Live Page</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600">Archive Page</DropdownMenuItem>
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

"use client";

import React, { useState } from "react";
import { 
  FileText, FolderOpen, UploadCloud, Search, MoreVertical, File, FileSignature, 
  ShieldCheck, Clock, Download, Eye, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockDocuments = [
  { id: "DOC-001", name: "Employee Handbook 2026.pdf", category: "Policy", owner: "HR Department", size: "2.4 MB", date: "Jan 10, 2026", status: "Published", type: "PDF" },
  { id: "DOC-002", name: "SJ_Employment_Contract.pdf", category: "Contracts", owner: "Sarah Jenkins", size: "1.1 MB", date: "Oct 20, 2026", status: "Signed", type: "PDF" },
  { id: "DOC-003", name: "Q3_Performance_Review_MC.docx", category: "Performance", owner: "Michael Chang", size: "845 KB", date: "Sep 30, 2026", status: "Private", type: "DOC" },
  { id: "DOC-004", name: "W4_Tax_Form_2026.pdf", category: "Tax Forms", owner: "David Foster", size: "1.8 MB", date: "Jan 15, 2026", status: "Archived", type: "PDF" },
  { id: "DOC-005", name: "NDA_Standard_Template.docx", category: "Templates", owner: "Legal Department", size: "450 KB", date: "Mar 12, 2025", status: "Published", type: "DOC" },
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = mockDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Center</h1>
          <p className="text-muted-foreground mt-1">Secure repository for employment contracts, policies, and files.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FolderOpen className="w-4 h-4 mr-2" /> New Folder</Button>
          <Button><UploadCloud className="w-4 h-4 mr-2" /> Upload Document</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-blue-500" /> Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">185 files</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Policies & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 files</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" /> Tax & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">420 files</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" /> Pending Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 files</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents by name or category..."
              className="pl-9 bg-muted/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[400px]">Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc) => (
                <TableRow key={doc.id} className="group hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {doc.type === "PDF" ? <FileText className="w-4 h-4" /> : <File className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-sm group-hover:text-primary transition-colors cursor-pointer">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.category}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {doc.owner}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {doc.size}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {doc.date}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      doc.status === "Published" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      doc.status === "Signed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      doc.status === "Private" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      "bg-muted text-muted-foreground border-border"
                    }>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                        <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-500 focus:bg-rose-500/10 focus:text-rose-600"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDocs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No documents found matching your search.
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

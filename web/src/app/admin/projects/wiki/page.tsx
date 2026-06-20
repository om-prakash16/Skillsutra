"use client";

import React, { useState } from "react";
import { 
  BookOpen, Plus, Search, Filter, FolderOpen, FileText,
  Clock, Hash, Star, Share2, MoreHorizontal, FileSpreadsheet, FileImage
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockDocs = [
  { id: "DOC-101", title: "Project Requirements Document (PRD)", folder: "Engineering Specs", author: "Sarah Jenkins", updated: "2 hours ago", type: "document", favorite: true },
  { id: "DOC-102", title: "Q4 Marketing Assets", folder: "Campaign Assets", author: "Anita Desai", updated: "Yesterday", type: "folder", favorite: true },
  { id: "DOC-103", title: "Database Migration Strategy", folder: "Architecture", author: "David Foster", updated: "Oct 12, 2026", type: "document", favorite: false },
  { id: "DOC-104", title: "Sprint 14 Retrospective", folder: "Meeting Notes", author: "Michael Chang", updated: "Oct 10, 2026", type: "document", favorite: false },
  { id: "DOC-105", title: "Budget Projections 2027", folder: "Finance", author: "Sarah Jenkins", updated: "Oct 05, 2026", type: "spreadsheet", favorite: false },
  { id: "DOC-106", title: "UI Mockups v2", folder: "Design", author: "Michael Chang", updated: "Oct 01, 2026", type: "image", favorite: true },
];

export default function WikiPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = mockDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 flex h-[calc(100vh-80px)]">
      {/* Sidebar Navigation for Wiki */}
      <div className="w-64 border-r border-border/50 pr-6 hidden md:flex flex-col">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Workspace Wiki
        </h2>
        <div className="relative w-full mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search wiki..." className="pl-9 h-9 bg-muted/50" />
        </div>
        
        <div className="space-y-1 mb-6">
          <Button variant="ghost" className="w-full justify-start font-medium bg-primary/5 text-primary">
            <Clock className="w-4 h-4 mr-2" /> Recent
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Star className="w-4 h-4 mr-2" /> Favorites
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Share2 className="w-4 h-4 mr-2" /> Shared with me
          </Button>
        </div>

        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Folders</h3>
        <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          {["Engineering Specs", "Campaign Assets", "Architecture", "Meeting Notes", "Finance", "Design"].map((folder) => (
            <Button key={folder} variant="ghost" size="sm" className="w-full justify-start text-muted-foreground font-normal hover:text-foreground h-8">
              <FolderOpen className="w-3.5 h-3.5 mr-2 shrink-0" /> {folder}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-6 flex flex-col min-w-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="hover:text-primary cursor-pointer">Workspace</span>
              <span>/</span>
              <span className="hover:text-primary cursor-pointer">Engineering Specs</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Recent Documents</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> New Folder</Button>
            <Button><Plus className="w-4 h-4 mr-2" /> New Page</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {mockDocs.filter(d => d.favorite).map((doc) => (
            <Card key={doc.id} className="border-border/50 shadow-sm bg-card hover:border-primary/40 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${
                    doc.type === 'document' ? 'bg-blue-500/10 text-blue-500' : 
                    doc.type === 'spreadsheet' ? 'bg-emerald-500/10 text-emerald-500' :
                    doc.type === 'folder' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-purple-500/10 text-purple-500'
                  }`}>
                    {doc.type === 'document' ? <FileText className="w-5 h-5" /> : 
                     doc.type === 'spreadsheet' ? <FileSpreadsheet className="w-5 h-5" /> :
                     doc.type === 'folder' ? <FolderOpen className="w-5 h-5" /> :
                     <FileImage className="w-5 h-5" />}
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-amber-500 hover:bg-amber-500/10">
                    <Star className="w-4 h-4 fill-amber-500" />
                  </Button>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">{doc.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                  <Hash className="w-3 h-3" /> {doc.folder}
                </p>
                <div className="mt-auto flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{doc.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{doc.updated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">All Files</h2>
          <div className="flex gap-2">
            <div className="relative w-full md:w-64 hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter files..."
                className="pl-9 h-9 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          </div>
        </div>

        <div className="border border-border/50 rounded-xl overflow-hidden bg-card flex-1">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/30 border-b border-border/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">Last Updated</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/20 group cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {doc.type === 'document' ? <FileText className="w-4 h-4 text-blue-500" /> : 
                         doc.type === 'spreadsheet' ? <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> :
                         doc.type === 'folder' ? <FolderOpen className="w-4 h-4 text-amber-500" /> :
                         <FileImage className="w-4 h-4 text-purple-500" />}
                        <span className="font-medium group-hover:text-primary transition-colors">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {doc.folder}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{doc.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{doc.author}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{doc.updated}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="w-4 h-4 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

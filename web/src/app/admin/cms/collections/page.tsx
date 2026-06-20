"use client";

import React, { useState } from "react";
import { 
  Database, Search, Filter, Plus, MoreHorizontal, LayoutTemplate, 
  Settings, Type, FileImage, Link as LinkIcon, Calendar, CheckSquare, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mockCollections = [
  { id: "COL-001", name: "Blog Posts", identifier: "blog_posts", type: "Content Type", entries: 145, fields: 12, status: "Active" },
  { id: "COL-002", name: "Case Studies", identifier: "case_studies", type: "Content Type", entries: 24, fields: 18, status: "Active" },
  { id: "COL-003", name: "Authors", identifier: "authors", type: "Taxonomy", entries: 15, fields: 6, status: "Active" },
  { id: "COL-004", name: "Testimonials", identifier: "testimonials", type: "Content Type", entries: 85, fields: 8, status: "Active" },
  { id: "COL-005", name: "Events", identifier: "events", type: "Content Type", entries: 42, fields: 15, status: "Draft" },
];

export default function CMSCollectionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Data Collections</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">24 Collections</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Define dynamic data schemas, relationships, and taxonomies for headless content generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button><Plus className="w-4 h-4 mr-2" /> New Collection Schema</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Collections List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search collections by name or identifier..." className="pl-9 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Collection Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entries</TableHead>
                    <TableHead>Schema Fields</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCollections.map((col) => (
                    <TableRow key={col.id} className={`group hover:bg-muted/20 cursor-pointer ${selectedCollection === col.id ? 'bg-primary/5' : ''}`} onClick={() => setSelectedCollection(col.id)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Database className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{col.name}</div>
                            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{col.identifier}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted text-muted-foreground">{col.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{col.entries}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <LayoutTemplate className="w-4 h-4" /> {col.fields} fields
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Collection Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Content Entries</DropdownMenuItem>
                            <DropdownMenuItem>Edit Schema Builder</DropdownMenuItem>
                            <DropdownMenuItem>API References</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-rose-600">Delete Collection</DropdownMenuItem>
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

        {/* Right Side: Schema Preview (Mock) */}
        <div className="lg:col-span-1 space-y-6">
          {selectedCollection ? (
            <Card className="border-border/50 shadow-sm sticky top-6 animate-in fade-in slide-in-from-right-4">
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">Schema Preview</CardTitle>
                    <CardDescription>{mockCollections.find(c => c.id === selectedCollection)?.name}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm"><Settings className="w-3.5 h-3.5 mr-2" /> Edit Schema</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                  <SchemaField icon={Type} name="title" type="String (Short)" required={true} />
                  <SchemaField icon={Type} name="slug" type="String (Slug)" required={true} unique={true} />
                  <SchemaField icon={FileImage} name="cover_image" type="Media Reference" required={false} />
                  <SchemaField icon={FileText} name="content" type="Rich Text (Markdown)" required={true} />
                  <SchemaField icon={Calendar} name="publish_date" type="DateTime" required={false} />
                  <SchemaField icon={LinkIcon} name="author" type="Reference (Authors)" required={true} />
                  <SchemaField icon={CheckSquare} name="is_featured" type="Boolean" required={false} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground h-full min-h-[400px]">
                <LayoutTemplate className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a collection to view its schema definition.</p>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}

function SchemaField({ icon: Icon, name, type, required = false, unique = false }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/10">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-muted rounded border border-border/50">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <div className="font-mono text-sm font-semibold">{name} {required && <span className="text-rose-500">*</span>}</div>
          <div className="text-xs text-muted-foreground">{type}</div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {unique && <Badge variant="outline" className="text-[9px] h-4 bg-amber-500/10 text-amber-600 border-amber-500/20">Unique</Badge>}
        {required && <Badge variant="outline" className="text-[9px] h-4 bg-rose-500/10 text-rose-600 border-rose-500/20">Required</Badge>}
      </div>
    </div>
  );
}

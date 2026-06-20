"use client";

import React, { useState } from "react";
import { 
  Network, Search, ZoomIn, ZoomOut, Maximize, Plus, MoreHorizontal, User, Mail, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

// Recursive type for Org Chart
type OrgNode = {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  initials: string;
  children?: OrgNode[];
};

const mockOrgData: OrgNode = {
  id: "CEO-1",
  name: "Emily Chen",
  role: "Chief Executive Officer",
  department: "Executive",
  initials: "EC",
  children: [
    {
      id: "CTO-1",
      name: "Marcus Johnson",
      role: "Chief Technology Officer",
      department: "Engineering",
      initials: "MJ",
      children: [
        {
          id: "VP-ENG-1",
          name: "Sarah Jenkins",
          role: "VP of Engineering",
          department: "Engineering",
          initials: "SJ",
          children: [
            { id: "EM-1", name: "Alex Kumar", role: "Engineering Manager", department: "Engineering", initials: "AK" },
            { id: "EM-2", name: "James Rodriguez", role: "Engineering Manager", department: "Engineering", initials: "JR" }
          ]
        },
        {
          id: "VP-PROD-1",
          name: "Michael Chang",
          role: "VP of Product",
          department: "Product",
          initials: "MC",
          children: [
            { id: "PM-1", name: "David Foster", role: "Lead Product Manager", department: "Product", initials: "DF" }
          ]
        }
      ]
    },
    {
      id: "CMO-1",
      name: "Anita Desai",
      role: "Chief Marketing Officer",
      department: "Marketing",
      initials: "AD",
      children: [
        { id: "VP-MKT-1", name: "Lisa Thompson", role: "VP of Growth", department: "Marketing", initials: "LT" }
      ]
    }
  ]
};

const OrgNodeCard = ({ node, isRoot = false }: { node: OrgNode, isRoot?: boolean }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10"
      >
        <Card className={`w-64 p-4 flex flex-col items-center text-center shadow-sm border-border/50 transition-all hover:shadow-md hover:border-primary/40 ${isRoot ? 'ring-2 ring-primary/20 bg-primary/5' : 'bg-card'}`}>
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <Avatar className={`w-16 h-16 border-2 ${isRoot ? 'border-primary/50' : 'border-border'} shadow-sm mb-3`}>
            <AvatarFallback className={isRoot ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}>
              {node.initials}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-bold text-sm text-foreground leading-tight">{node.name}</h3>
          <p className="text-xs text-primary/80 font-medium mt-1">{node.role}</p>
          <Badge variant="secondary" className="mt-2 text-[10px] font-normal bg-muted/50">
            {node.department}
          </Badge>

          {hasChildren && (
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute -bottom-4 h-8 w-8 rounded-full bg-background border-border shadow-sm z-20 hover:bg-muted"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </Card>
      </motion.div>

      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center"
          >
            {/* Vertical connector from parent to horizontal line */}
            <div className="w-px h-8 bg-border" />
            
            {/* Horizontal connector line */}
            <div className="relative flex justify-center w-full">
              {node.children!.length > 1 && (
                <div 
                  className="absolute top-0 h-px bg-border" 
                  style={{ 
                    width: `calc(100% - ${100 / node.children!.length}%)`,
                  }} 
                />
              )}
              
              {/* Children nodes */}
              <div className="flex justify-center gap-8 pt-6 relative">
                {node.children!.map((child, index) => (
                  <div key={child.id} className="relative flex flex-col items-center">
                    {/* Vertical connector from horizontal line to child */}
                    <div className="absolute -top-6 w-px h-6 bg-border" />
                    <OrgNodeCard node={child} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function OrgChartPage() {
  const [scale, setScale] = useState(1);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-6 pb-0 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Chart</h1>
          <p className="text-muted-foreground mt-1">Interactive visual hierarchy of the company.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Find employee..." className="pl-9 bg-muted/50" />
          </div>
          
          <div className="flex items-center bg-muted/50 rounded-md border border-border/50 p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(s => Math.min(2, s + 0.1))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale(1)}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-12 flex justify-center cursor-grab active:cursor-grabbing bg-grid-white/[0.02] relative">
        <motion.div 
          className="flex justify-center origin-top"
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <OrgNodeCard node={mockOrgData} isRoot={true} />
        </motion.div>
      </div>
    </div>
  );
}

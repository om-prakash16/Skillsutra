import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, MoreHorizontal } from "lucide-react";

interface ActionBarProps {
  primaryAction?: {
    label: string;
    icon?: React.ElementType;
    onClick?: () => void;
  };
  secondaryActions?: {
    label: string;
    icon?: React.ElementType;
    onClick?: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  }[];
  showExport?: boolean;
  showImport?: boolean;
  onExport?: () => void;
  onImport?: () => void;
  customActions?: React.ReactNode;
}

export function ActionBar({
  primaryAction,
  secondaryActions,
  showExport,
  showImport,
  onExport,
  onImport,
  customActions
}: ActionBarProps) {
  return (
    <div className="flex items-center gap-2">
      {customActions}
      
      {showImport && (
        <Button variant="outline" size="sm" onClick={onImport} className="h-9">
          <Upload className="w-4 h-4 mr-2 text-slate-500" />
          Import
        </Button>
      )}
      
      {showExport && (
        <Button variant="outline" size="sm" onClick={onExport} className="h-9">
          <Download className="w-4 h-4 mr-2 text-slate-500" />
          Export
        </Button>
      )}

      {secondaryActions?.map((action, idx) => (
        <Button 
          key={idx} 
          variant={action.variant || "outline"} 
          size="sm" 
          onClick={action.onClick}
          className="h-9"
        >
          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
          {action.label}
        </Button>
      ))}

      {primaryAction && (
        <Button 
          size="sm" 
          onClick={primaryAction.onClick}
          className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          {primaryAction.icon ? <primaryAction.icon className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {primaryAction.label}
        </Button>
      )}

      {/* Overflow Menu Stub */}
      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  );
}

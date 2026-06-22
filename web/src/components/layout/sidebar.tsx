"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Search, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Moon, 
  LogOut, 
  Settings, 
  Star, 
  Clock, 
  UserCircle 
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useNavigationStore } from "@/store/navigation-store";
import { superAdminNavigation, NavItem as NavItemType } from "@/config/navigation";
import { NavItem } from "@/components/layout/nav-item";
import { Icon } from "@/components/ui/icon";

interface SidebarProps {
  role: string;
  className?: string;
  variant?: "default" | "mobile";
}

// Helper to flatten the tree to find items by ID (for Favorites and Recents)
const flattenNav = (items: NavItemType[]): NavItemType[] => {
  let flat: NavItemType[] = [];
  for (const item of items) {
    flat.push(item);
    if (item.children) {
      flat = flat.concat(flattenNav(item.children));
    }
  }
  return flat;
};

export function Sidebar({ role, className, variant = "default" }: SidebarProps) {
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar, favorites, recent } = useNavigationStore();
  const [searchTerm, setSearchTerm] = useState("");

  const allItems = flattenNav(superAdminNavigation);
  const favoriteItems = favorites.map(id => allItems.find(i => i.id === id)).filter(Boolean) as NavItemType[];
  const recentItems = recent.map(id => allItems.find(i => i.id === id)).filter(Boolean) as NavItemType[];

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-background border-r border-slate-200 transition-all duration-300 z-50 shrink-0",
        isCollapsed ? "w-[72px]" : "w-[280px]",
        className
      )}
    >
      {/* Top Header - Fixed */}
      <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-slate-100">
        <Link href="/superadmin" className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center w-full")}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 truncate tracking-tight">Nexus OS</span>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Super Admin</span>
            </div>
          )}
        </Link>
        
        {!isCollapsed && (
          <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0 text-slate-400 hover:text-slate-600" onClick={toggleSidebar}>
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Global Search - Fixed */}
      {!isCollapsed && (
        <div className="p-4 shrink-0 border-b border-slate-100">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search modules, pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-mono text-slate-400">⌘K</div>
          </div>
        </div>
      )}

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="p-4 shrink-0 flex justify-center border-b border-slate-100">
          <Button variant="ghost" size="icon" className="w-10 h-10 text-slate-400 hover:text-slate-600" onClick={toggleSidebar}>
            <PanelLeftOpen className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-4 space-y-6">
        
        {/* Favorites */}
        {!isCollapsed && favoriteItems.length > 0 && !searchTerm && (
          <div className="space-y-1">
            <div className="px-3 mb-2 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pinned</h4>
            </div>
            {favoriteItems.map(item => (
               <NavItem key={`fav-${item.id}`} item={item} level={1} isSidebarCollapsed={isCollapsed} />
            ))}
          </div>
        )}

        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && !searchTerm && (
             <div className="px-3 mb-2 mt-4">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modules</h4>
             </div>
          )}
          {superAdminNavigation.map(group => (
            <NavItem 
              key={group.id} 
              item={group} 
              searchTerm={searchTerm} 
              isSidebarCollapsed={isCollapsed} 
            />
          ))}
        </div>

        {/* Recent Pages */}
        {!isCollapsed && recentItems.length > 0 && !searchTerm && (
          <div className="space-y-1 mt-6 border-t border-slate-100 pt-6">
            <div className="px-3 mb-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent</h4>
            </div>
            {recentItems.slice(0, 5).map(item => (
               <NavItem key={`recent-${item.id}`} item={item} level={1} isSidebarCollapsed={isCollapsed} />
            ))}
          </div>
        )}

      </div>

      {/* Bottom Footer - Fixed */}
      <div className="p-4 shrink-0 border-t border-slate-100 bg-slate-50/50">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                <UserCircle className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-900 truncate">{user?.name || "Admin"}</span>
                <span className="text-xs text-slate-500 truncate">{user?.email || "admin@example.com"}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0 text-slate-400 hover:text-slate-900" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-slate-500" />
            </div>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-900" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

    </aside>
  );
}

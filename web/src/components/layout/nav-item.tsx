"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import { NavItem as NavItemType } from "@/config/navigation";
import { useNavigationStore } from "@/store/navigation-store";
import { Icon } from "@/components/ui/icon";

interface NavItemProps {
  item: NavItemType;
  level?: number;
  searchTerm?: string;
  isSidebarCollapsed?: boolean;
}

export function NavItem({ item, level = 1, searchTerm = "", isSidebarCollapsed = false }: NavItemProps) {
  const pathname = usePathname();
  const { expandedItems, toggleExpanded, favorites, addFavorite, removeFavorite } = useNavigationStore();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = expandedItems.includes(item.id);
  const isPinned = favorites.includes(item.id);

  // Check if active
  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false;
  
  // Also check if any child is active
  const hasActiveChild = React.useMemo(() => {
    const checkActive = (node: NavItemType): boolean => {
      if (node.href && (pathname === node.href || pathname.startsWith(node.href + "/"))) return true;
      if (node.children) return node.children.some(checkActive);
      return false;
    };
    return item.children ? item.children.some(checkActive) : false;
  }, [pathname, item.children]);

  // Expand if active and not already expanded (only on mount or route change)
  useEffect(() => {
    if ((isActive || hasActiveChild) && !isExpanded && !searchTerm) {
      toggleExpanded(item.id);
    }
  }, [isActive, hasActiveChild, pathname]);

  // If search term exists, and we don't match (and children don't match), don't render
  const matchesSearch = searchTerm 
    ? item.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.children && item.children.some(child => JSON.stringify(child).toLowerCase().includes(searchTerm.toLowerCase())))
    : true;

  if (!matchesSearch) return null;

  // Force expand during search
  const shouldExpand = searchTerm ? true : isExpanded;

  const handleToggle = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      toggleExpanded(item.id);
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPinned) {
      removeFavorite(item.id);
    } else {
      addFavorite(item.id);
    }
  };

  const paddingLeft = level === 1 ? "0.75rem" : `${0.75 + (level - 1) * 0.75}rem`;

  const linkContent = (
    <div 
      className={cn(
        "flex items-center justify-between py-2 pr-3 rounded-lg cursor-pointer transition-all group relative",
        isActive && !item.children ? "bg-indigo-500/10 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        isSidebarCollapsed ? "justify-center px-0" : ""
      )}
      style={{ paddingLeft: isSidebarCollapsed ? "0" : paddingLeft }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleToggle}
    >
      <div className={cn("flex items-center gap-3 min-w-0", isSidebarCollapsed && "justify-center w-full")}>
        {item.icon && (
          <Icon 
            name={item.icon} 
            size={level === 1 ? 18 : 16} 
            className={cn(
              "shrink-0 transition-colors", 
              isActive && !item.children ? "text-indigo-600" : (hasActiveChild && level === 1) ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-600"
            )} 
          />
        )}
        
        {!isSidebarCollapsed && (
          <span className={cn(
            "truncate text-sm font-medium transition-colors",
            level === 1 ? "font-semibold" : "font-medium"
          )}>
            {item.label}
          </span>
        )}
      </div>

      {!isSidebarCollapsed && (
        <div className="flex items-center gap-2 shrink-0">
          {/* Badges */}
          {item.badges && (
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-bold",
              item.badges.variant === 'warning' ? "bg-amber-100 text-amber-700" :
              item.badges.variant === 'success' ? "bg-emerald-100 text-emerald-700" :
              "bg-slate-100 text-slate-600"
            )}>
              {item.badges.text}
            </span>
          )}

          {/* Pin Button (shows on hover) */}
          {(isHovered || isPinned) && !item.children && (
            <Star 
              className={cn("w-3.5 h-3.5 transition-colors", isPinned ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-400")} 
              onClick={handlePin}
            />
          )}

          {/* Chevron for children */}
          {item.children && (
            <ChevronDown 
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-200", 
                shouldExpand ? "rotate-180" : ""
              )} 
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-0.5">
      {item.href && !item.children ? (
        <Link href={item.href} className="block">
          {linkContent}
        </Link>
      ) : (
        linkContent
      )}

      {/* Render Children */}
      {item.children && !isSidebarCollapsed && (
        <AnimatePresence initial={false}>
          {shouldExpand && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 relative">
                {/* Visual connection line for nested items */}
                {level >= 1 && (
                  <div className="absolute left-[1.1rem] top-0 bottom-0 w-px bg-slate-200" />
                )}
                {item.children.map(child => (
                  <NavItem 
                    key={child.id} 
                    item={child} 
                    level={level + 1} 
                    searchTerm={searchTerm} 
                    isSidebarCollapsed={isSidebarCollapsed}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

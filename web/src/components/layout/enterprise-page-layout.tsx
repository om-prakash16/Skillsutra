import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface EnterprisePageLayoutProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
  statsCards?: React.ReactNode;
  toolbar?: React.ReactNode;
  filters?: React.ReactNode;
  actionBar?: React.ReactNode;
  pagination?: React.ReactNode;
  timeline?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function EnterprisePageLayout({
  breadcrumbs,
  title,
  description,
  statsCards,
  toolbar,
  filters,
  actionBar,
  pagination,
  timeline,
  children,
  className
}: EnterprisePageLayoutProps) {
  return (
    <div className={cn("max-w-[1600px] w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-3">
          
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
              <span className="text-slate-400">Super Admin</span>
              <ChevronRight className="w-3.5 h-3.5 mx-1 opacity-50" />
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  {bc.href ? (
                    <Link href={bc.href} className="hover:text-indigo-600 transition-colors">
                      {bc.label}
                    </Link>
                  ) : (
                    <span className={idx === breadcrumbs.length - 1 ? "text-slate-900 font-bold" : ""}>
                      {bc.label}
                    </span>
                  )}
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 mx-1 opacity-50" />
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Title & Description */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
            {description && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Top-Right Action Bar (Create, Export, etc) */}
        {actionBar && (
          <div className="flex items-center gap-3 shrink-0">
            {actionBar}
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      {statsCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards}
        </div>
      )}

      {/* Toolbar & Filters */}
      {(toolbar || filters) && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-full sm:w-auto flex-1">
            {toolbar}
          </div>
          <div className="flex items-center gap-2">
            {filters}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {children}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-center pt-4">
          {pagination}
        </div>
      )}

      {/* Activity Timeline / Audit History */}
      {timeline && (
        <div className="pt-8 mt-8 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity Timeline</h3>
          {timeline}
        </div>
      )}

    </div>
  );
}

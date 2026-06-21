"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface EnterprisePageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function EnterprisePageLayout({ children, sidebar, className, ...props }: EnterprisePageLayoutProps) {
  return (
    <div className={cn("flex flex-1 flex-col md:flex-row h-full overflow-hidden bg-background", className)} {...props}>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {children}
        </div>
      </main>
      {sidebar && (
        <aside className="w-full md:w-80 border-l bg-muted/20 p-4 md:p-6 overflow-y-auto hidden md:block">
          {sidebar}
        </aside>
      )}
    </div>
  )
}

export function PageHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 mb-6", className)} {...props}>
      {children}
    </div>
  )
}

export function PageTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("text-3xl font-bold tracking-tight", className)} {...props}>
      {children}
    </h1>
  )
}

export function PageDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function Toolbar({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4", className)} {...props}>
      {children}
    </div>
  )
}

export function ActionBar({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

export function FilterBar({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

export function StatisticsContainer({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6", className)} {...props}>
      {children}
    </div>
  )
}

export function ContentArea({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-card border rounded-xl shadow-sm overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

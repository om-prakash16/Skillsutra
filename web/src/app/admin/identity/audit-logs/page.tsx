"use client"

import * as React from "react"
import { 
  EnterprisePageLayout, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  ActionBar, 
  EnterpriseDataTable, 
  Column 
} from "@/components/enterprise"
import { Button } from "@/components/ui/button"
import { ClipboardList, Download, Code, Layers } from "lucide-react"

interface AuditLog {
  id: string
  user: {
    id: string
    email: string
  }
  action: string
  resource_type: string
  resource_id: string
  details: any
  trace_id: string | null
  correlation_id: string | null
  severity: string
  ip_address: string
  created_at: string
}

export default function AuditLogsPage() {
  const [data, setData] = React.useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/audit-logs?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch Audit Logs", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const columns: Column<AuditLog>[] = [
    {
      key: "actor",
      title: "Actor",
      render: (l) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{l.user.email}</span>
          <span className="text-[10px] text-muted-foreground">{l.ip_address}</span>
        </div>
      )
    },
    {
      key: "action",
      title: "Action",
      render: (l) => <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-bold text-blue-700">{l.action}</code>
    },
    {
      key: "resource",
      title: "Resource",
      render: (l) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium">{l.resource_type}</span>
          {l.resource_id && <span className="text-[10px] text-muted-foreground font-mono">{l.resource_id.substring(0, 8)}...</span>}
        </div>
      )
    },
    {
      key: "tracing",
      title: "Tracing",
      render: (l) => l.trace_id ? <span className="text-[10px] font-mono text-muted-foreground bg-slate-100 p-1 rounded">{l.trace_id.substring(0,8)}</span> : <span className="text-muted-foreground">-</span>
    },
    {
      key: "created_at",
      title: "Timestamp",
      render: (l) => <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span>
    },
    {
      key: "payload",
      title: "",
      render: (l) => (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600">
          <Code className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Global Audit Center</PageTitle>
          <PageDescription>Immutable ledger of all administrative and user actions across the platform.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><ClipboardList className="h-4 w-4"/> Total Logs Indexed</div>
          <div className="text-2xl font-bold">{total}</div>
        </div>
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Layers className="h-4 w-4"/> Retention Period</div>
          <div className="text-2xl font-bold">1 Year</div>
        </div>
      </div>

      <EnterpriseDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchable={true}
        onSearch={(q) => {
          setPage(1)
          setSearch(q)
        }}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage
        }}
      />
    </EnterprisePageLayout>
  )
}

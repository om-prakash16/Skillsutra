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
import { Users, Plus, ShieldX, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ImpersonationSession {
  id: string
  impersonator_id: string
  target_user_id: string
  reason: string
  status: string
  mode: string
  started_at: string
  ended_at: string | null
  expires_at: string
}

export default function ImpersonationPage() {
  const [data, setData] = React.useState<ImpersonationSession[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [statusFilter, setStatusFilter] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentStatus: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/impersonation?page=${currentPage}&size=${pageSize}${currentStatus ? `&status=${currentStatus}` : ""}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch Impersonation Sessions", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, statusFilter)
  }, [page, statusFilter])

  const terminateSession = async (id: string) => {
    if(!confirm("Force terminate this impersonation session? The administrator will be immediately ejected.")) return
    try {
      await fetch(`/api/v1/admin/impersonation/${id}/terminate`, { method: "POST" })
      fetchData(page, statusFilter)
    } catch (e) {
      console.error("Failed to terminate session", e)
    }
  }

  const columns: Column<ImpersonationSession>[] = [
    {
      key: "target",
      title: "Target User (Impersonated)",
      render: (s) => <span className="font-mono text-xs">{s.target_user_id.substring(0, 8)}...</span>
    },
    {
      key: "impersonator",
      title: "Admin (Impersonator)",
      render: (s) => <span className="font-mono text-xs">{s.impersonator_id.substring(0, 8)}...</span>
    },
    {
      key: "reason",
      title: "Reason",
      render: (s) => <span className="text-sm font-medium">{s.reason}</span>
    },
    {
      key: "mode",
      title: "Mode",
      render: (s) => (
        <Badge variant="outline" className={s.mode === "READ_ONLY" ? "border-blue-200 text-blue-700 bg-blue-50" : "border-red-200 text-red-700 bg-red-50"}>
          {s.mode.replace("_", " ")}
        </Badge>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (s) => (
        <Badge variant={s.status === "ACTIVE" ? "default" : "secondary"} 
          className={s.status === "ACTIVE" ? "bg-green-600 hover:bg-green-700" : ""}>
          {s.status}
        </Badge>
      )
    },
    {
      key: "started_at",
      title: "Started",
      render: (s) => <span className="text-xs text-muted-foreground">{new Date(s.started_at).toLocaleString()}</span>
    },
    {
      key: "actions",
      title: "",
      render: (s) => s.status === "ACTIVE" && (
        <Button variant="ghost" size="sm" onClick={() => terminateSession(s.id)} className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
          <ShieldX className="h-4 w-4 mr-2" /> Force Stop
        </Button>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Impersonation Center</PageTitle>
          <PageDescription>Audit active admin impersonation sessions and initiate new read-only troubleshooting sessions.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button className="gap-2"><PlayCircle className="h-4 w-4" /> Start Impersonation</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Users className="h-4 w-4"/> Impersonation History</div>
          <div className="text-2xl font-bold">{total}</div>
        </div>
      </div>

      <EnterpriseDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchable={false}
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

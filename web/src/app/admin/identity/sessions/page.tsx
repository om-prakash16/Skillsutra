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
import { Laptop, XCircle, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Session {
  id: string
  user_id: string
  device_id: string | null
  browser: string
  os: string
  ip_address: string
  country: string
  city: string
  login_method: string
  mfa_used: boolean
  oauth_provider: string | null
  risk_score: number
  jti: string
  is_active: boolean
  expires_at: string
  created_at: string
}

export default function SessionsPage() {
  const [data, setData] = React.useState<Session[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/sessions?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch sessions", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const terminateSession = async (id: string) => {
    if(!confirm("Are you sure you want to terminate this session? The user will be instantly logged out.")) return
    try {
      await fetch(`/api/v1/admin/sessions/${id}/terminate`, { method: "POST" })
      fetchData(page, search)
    } catch (e) {
      console.error("Failed to terminate session", e)
    }
  }

  const columns: Column<Session>[] = [
    {
      key: "device",
      title: "Device / OS",
      render: (s) => (
        <div className="flex items-center gap-3">
          <Laptop className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{s.os || "Unknown OS"} • {s.browser}</span>
            <span className="text-xs text-muted-foreground">{s.city ? `${s.city}, ${s.country}` : "Unknown Location"}</span>
          </div>
        </div>
      )
    },
    {
      key: "ip",
      title: "IP Address",
      render: (s) => <span className="font-mono text-sm">{s.ip_address || "N/A"}</span>
    },
    {
      key: "security",
      title: "Security Context",
      render: (s) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase">{s.login_method || s.oauth_provider || "Standard"}</span>
            {s.mfa_used && <Badge variant="outline" className="text-[10px] h-4 px-1 border-blue-200 text-blue-700 bg-blue-50">MFA</Badge>}
          </div>
          {s.risk_score > 50 && (
            <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
              <ShieldAlert className="h-3 w-3" /> High Risk ({s.risk_score})
            </div>
          )}
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (s) => (
        <Badge variant={!s.is_active ? "secondary" : "outline"} 
          className={s.is_active ? "bg-green-50 text-green-700 border-green-200" : ""}>
          {s.is_active ? "Active" : "Terminated"}
        </Badge>
      )
    },
    {
      key: "created_at",
      title: "Created",
      render: (s) => <span className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleString()}</span>
    },
    {
      key: "actions",
      title: "",
      render: (s) => s.is_active && (
        <Button variant="ghost" size="sm" onClick={() => terminateSession(s.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
          <XCircle className="h-4 w-4 mr-2" /> Terminate
        </Button>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Active Sessions</PageTitle>
          <PageDescription>Monitor and terminate active user sessions and view security context (MFA, Risk Scores).</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="destructive" className="gap-2"><XCircle className="h-4 w-4" /> Terminate All Idle</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Laptop className="h-4 w-4"/> Total Sessions</div>
          <div className="text-2xl font-bold">{total}</div>
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

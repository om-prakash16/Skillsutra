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
import { History, Search, ShieldAlert, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LoginHistory {
  id: string
  user: {
    id: string
    email: string
  }
  ip_address: string
  country: string
  city: string
  browser: string
  os: string
  method: string
  mfa_used: boolean
  risk_score: number
  status: string
  failure_reason: string | null
  login_time: string
}

export default function LoginHistoryPage() {
  const [data, setData] = React.useState<LoginHistory[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/login-history?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch Login History", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const columns: Column<LoginHistory>[] = [
    {
      key: "user",
      title: "User / Identity",
      render: (h) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{h.user.email}</span>
          <span className="text-xs text-muted-foreground font-mono">{h.user.id.substring(0, 8)}...</span>
        </div>
      )
    },
    {
      key: "location",
      title: "Network & Location",
      render: (h) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs">{h.ip_address}</span>
          <span className="text-xs text-muted-foreground">{h.city ? `${h.city}, ${h.country}` : "Unknown Location"}</span>
        </div>
      )
    },
    {
      key: "device",
      title: "Device",
      render: (h) => <span className="text-xs text-muted-foreground">{h.os || "Unknown"} • {h.browser || "Unknown"}</span>
    },
    {
      key: "security",
      title: "Security Context",
      render: (h) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground border px-1 rounded">{h.method}</span>
            {h.mfa_used && <Badge variant="outline" className="text-[10px] h-4 px-1 border-blue-200 text-blue-700 bg-blue-50">MFA</Badge>}
          </div>
          {h.risk_score > 50 && (
            <div className="flex items-center gap-1 text-red-600 text-xs font-medium mt-1">
              <ShieldAlert className="h-3 w-3" /> High Risk ({h.risk_score})
            </div>
          )}
        </div>
      )
    },
    {
      key: "status",
      title: "Outcome",
      render: (h) => (
        <div className="flex flex-col gap-1 items-start">
          <Badge variant={h.status === "success" ? "outline" : "destructive"} 
            className={h.status === "success" ? "bg-green-50 text-green-700 border-green-200" : ""}>
            {h.status.toUpperCase()}
          </Badge>
          {h.failure_reason && <span className="text-[10px] text-red-600">{h.failure_reason}</span>}
        </div>
      )
    },
    {
      key: "login_time",
      title: "Timestamp",
      render: (h) => <span className="text-xs text-muted-foreground">{new Date(h.login_time).toLocaleString()}</span>
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Login History & Analytics</PageTitle>
          <PageDescription>Global authentication ledger tracking all successful and failed access attempts.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><History className="h-4 w-4"/> Auth Events</div>
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

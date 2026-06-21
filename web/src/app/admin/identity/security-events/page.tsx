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
import { ShieldAlert, Download, AlertTriangle, AlertCircle, Info, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SecurityEvent {
  id: string
  user: {
    id: string
    email: string
  }
  event_type: string
  severity: string
  description: string
  ip_address: string
  device_id: string | null
  created_at: string
}

export default function SecurityEventsPage() {
  const [data, setData] = React.useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/security-events?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch Security Events", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const renderSeverityBadge = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700"><ShieldAlert className="h-3 w-3 mr-1"/> CRITICAL</Badge>
      case "HIGH":
        return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600"><AlertTriangle className="h-3 w-3 mr-1"/> HIGH</Badge>
      case "MEDIUM":
        return <Badge variant="outline" className="border-yellow-400 text-yellow-700 bg-yellow-50"><AlertCircle className="h-3 w-3 mr-1"/> MEDIUM</Badge>
      default:
        return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50"><Info className="h-3 w-3 mr-1"/> LOW</Badge>
    }
  }

  const columns: Column<SecurityEvent>[] = [
    {
      key: "severity",
      title: "Severity",
      render: (e) => renderSeverityBadge(e.severity)
    },
    {
      key: "event_type",
      title: "Event Type",
      render: (e) => <span className="font-semibold text-sm">{e.event_type}</span>
    },
    {
      key: "description",
      title: "Description",
      render: (e) => <span className="text-sm text-muted-foreground line-clamp-2" title={e.description}>{e.description}</span>
    },
    {
      key: "target",
      title: "Target / Actor",
      render: (e) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{e.user.email}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{e.ip_address || "System"}</span>
        </div>
      )
    },
    {
      key: "created_at",
      title: "Timestamp",
      render: (e) => <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Security Operations Center</PageTitle>
          <PageDescription>Monitor, correlate, and investigate security events, anomalies, and policy violations.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2"><Shield className="h-4 w-4"/> Events (30d)</div>
            <div className="text-2xl font-bold">{total}</div>
          </div>
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

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
import { ShieldAlert, ShieldX, KeySquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MFAMethod {
  id: string
  user_id: string
  method_type: string
  is_primary: boolean
  is_enabled: boolean
  last_used_at: string | null
  created_at: string
}

export default function MFAPage() {
  const [data, setData] = React.useState<MFAMethod[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const pageSize = 50

  const fetchData = async (currentPage: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/mfa?page=${currentPage}&size=${pageSize}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch MFA methods", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page)
  }, [page])

  const disableMFA = async (id: string) => {
    if(!confirm("Are you sure you want to administratively disable this MFA method? The user will lose this factor.")) return
    try {
      await fetch(`/api/v1/admin/mfa/${id}/disable`, { method: "POST" })
      fetchData(page)
    } catch (e) {
      console.error("Failed to disable MFA", e)
    }
  }

  const columns: Column<MFAMethod>[] = [
    {
      key: "method_type",
      title: "MFA Type",
      render: (m) => (
        <div className="flex items-center gap-3">
          <KeySquare className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm uppercase">{m.method_type}</span>
            {m.is_primary && <span className="text-xs text-blue-600 font-medium">Primary Method</span>}
          </div>
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (m) => (
        <Badge variant={m.is_enabled ? "outline" : "secondary"} 
          className={m.is_enabled ? "bg-green-50 text-green-700 border-green-200" : ""}>
          {m.is_enabled ? "Enabled" : "Disabled"}
        </Badge>
      )
    },
    {
      key: "last_used",
      title: "Last Used",
      render: (m) => <span className="text-sm text-muted-foreground">{m.last_used_at ? new Date(m.last_used_at).toLocaleString() : "Never"}</span>
    },
    {
      key: "created_at",
      title: "Configured",
      render: (m) => <span className="text-sm text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
    },
    {
      key: "actions",
      title: "",
      render: (m) => m.is_enabled && (
        <Button variant="ghost" size="sm" onClick={() => disableMFA(m.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
          <ShieldX className="h-4 w-4 mr-2" /> Disable
        </Button>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>MFA Management</PageTitle>
          <PageDescription>Audit user Multi-Factor Authentication setups, enforce policies, and perform emergency resets.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2">Enforcement Policies</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><ShieldAlert className="h-4 w-4"/> Configured Factors</div>
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

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
import { Server, Plus, CheckCircle, XCircle, Key } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ServiceAccount {
  id: string
  name: string
  description: string
  is_active: boolean
  created_at: string
}

export default function ServiceAccountsPage() {
  const [data, setData] = React.useState<ServiceAccount[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/service-accounts?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch Service Accounts", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const toggleSA = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/v1/admin/service-accounts/${id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus })
      })
      fetchData(page, search)
    } catch (e) {
      console.error("Failed to toggle Service Account", e)
    }
  }

  const columns: Column<ServiceAccount>[] = [
    {
      key: "name",
      title: "Service Account",
      render: (a) => (
        <div className="flex flex-col">
          <span className="font-semibold">{a.name}</span>
          <span className="text-xs text-muted-foreground">{a.description}</span>
        </div>
      )
    },
    {
      key: "id",
      title: "SA ID",
      render: (a) => <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">{a.id}</code>
    },
    {
      key: "status",
      title: "Status",
      render: (a) => (
        <Badge variant={a.is_active ? "outline" : "secondary"} 
          className={a.is_active ? "bg-green-50 text-green-700 border-green-200" : ""}>
          {a.is_active ? "Active" : "Disabled"}
        </Badge>
      )
    },
    {
      key: "created_at",
      title: "Created",
      render: (a) => <span className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
    },
    {
      key: "actions",
      title: "",
      render: (a) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Key className="h-4 w-4 mr-2" /> Manage Keys
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toggleSA(a.id, a.is_active)} 
            className={a.is_active ? "text-red-500 hover:text-red-600 hover:bg-red-50 h-8" : "text-green-600 hover:text-green-700 hover:bg-green-50 h-8"}>
            {a.is_active ? <><XCircle className="h-4 w-4 mr-2" /> Disable</> : <><CheckCircle className="h-4 w-4 mr-2" /> Enable</>}
          </Button>
        </div>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Service Accounts</PageTitle>
          <PageDescription>Manage dedicated non-human identities for APIs, workflows, and integrations.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Create Service Account</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Server className="h-4 w-4"/> Active Service Accounts</div>
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

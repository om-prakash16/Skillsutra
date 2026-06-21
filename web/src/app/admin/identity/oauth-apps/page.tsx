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
import { ShieldCheck, Plus, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OAuthApp {
  id: string
  name: string
  display_name: string
  client_id: string
  scopes: string[]
  redirect_uris: string[]
  is_active: boolean
  created_at: string
}

export default function OAuthAppsPage() {
  const [data, setData] = React.useState<OAuthApp[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/oauth-apps?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch OAuth Apps", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const toggleApp = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/v1/admin/oauth-apps/${id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus })
      })
      fetchData(page, search)
    } catch (e) {
      console.error("Failed to toggle OAuth App", e)
    }
  }

  const columns: Column<OAuthApp>[] = [
    {
      key: "display_name",
      title: "Provider Name",
      render: (a) => (
        <div className="flex flex-col">
          <span className="font-semibold">{a.display_name}</span>
          <span className="text-xs text-muted-foreground">{a.name}</span>
        </div>
      )
    },
    {
      key: "client_id",
      title: "Client ID",
      render: (a) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{a.client_id}</code>
    },
    {
      key: "scopes",
      title: "Scopes",
      render: (a) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {a.scopes?.map(s => <Badge key={s} variant="secondary" className="text-[10px] h-4 px-1">{s}</Badge>)}
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (a) => (
        <Badge variant={a.is_active ? "outline" : "secondary"} 
          className={a.is_active ? "bg-green-50 text-green-700 border-green-200" : ""}>
          {a.is_active ? "Enabled" : "Disabled"}
        </Badge>
      )
    },
    {
      key: "actions",
      title: "",
      render: (a) => (
        <Button variant="ghost" size="sm" onClick={() => toggleApp(a.id, a.is_active)} 
          className={a.is_active ? "text-red-500 hover:text-red-600 hover:bg-red-50 h-8" : "text-green-600 hover:text-green-700 hover:bg-green-50 h-8"}>
          {a.is_active ? <><XCircle className="h-4 w-4 mr-2" /> Disable</> : <><CheckCircle className="h-4 w-4 mr-2" /> Enable</>}
        </Button>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>OAuth Applications</PageTitle>
          <PageDescription>Manage external Identity Providers and Single Sign-On (SSO) clients.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Register Provider</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><ShieldCheck className="h-4 w-4"/> Configured Providers</div>
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

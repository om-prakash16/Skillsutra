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
import { Key, Plus, RefreshCw, ShieldOff, Server } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface APIKey {
  id: string
  name: string
  prefix: string
  scopes: string[]
  is_active: boolean
  last_used_at: string | null
  expires_at: string | null
  created_at: string
  user_id: string | null
  service_account_id: string | null
}

export default function APIKeysPage() {
  const [data, setData] = React.useState<APIKey[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/api-keys?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch API Keys", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const revokeKey = async (id: string) => {
    if(!confirm("Are you sure you want to permanently revoke this API Key? Any systems using it will instantly fail.")) return
    try {
      await fetch(`/api/v1/admin/api-keys/${id}/revoke`, { method: "POST" })
      fetchData(page, search)
    } catch (e) {
      console.error("Failed to revoke API key", e)
    }
  }

  const rotateKey = async (id: string) => {
    if(!confirm("Are you sure you want to rotate this key? The previous token will instantly be invalidated.")) return
    try {
      const res = await fetch(`/api/v1/admin/api-keys/${id}/rotate`, { method: "POST" })
      const json = await res.json()
      if (json.data?.new_raw_key) {
        prompt("WARNING: This is the ONLY time you will see this key. Copy it now:", json.data.new_raw_key)
      }
      fetchData(page, search)
    } catch (e) {
      console.error("Failed to rotate API key", e)
    }
  }

  const columns: Column<APIKey>[] = [
    {
      key: "name",
      title: "Key Name",
      render: (k) => (
        <div className="flex flex-col">
          <span className="font-semibold">{k.name}</span>
          {k.service_account_id ? (
            <span className="text-[10px] flex items-center text-purple-600 mt-1"><Server className="h-3 w-3 mr-1" /> Service Account</span>
          ) : (
            <span className="text-[10px] text-muted-foreground mt-1">Personal Access Token</span>
          )}
        </div>
      )
    },
    {
      key: "prefix",
      title: "Token Prefix",
      render: (k) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{k.prefix}••••••••</code>
    },
    {
      key: "status",
      title: "Status",
      render: (k) => (
        <Badge variant={k.is_active ? "outline" : "secondary"} 
          className={k.is_active ? "bg-green-50 text-green-700 border-green-200" : ""}>
          {k.is_active ? "Active" : "Revoked"}
        </Badge>
      )
    },
    {
      key: "last_used",
      title: "Last Used",
      render: (k) => <span className="text-sm text-muted-foreground">{k.last_used_at ? new Date(k.last_used_at).toLocaleString() : "Never"}</span>
    },
    {
      key: "actions",
      title: "",
      render: (k) => k.is_active && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => rotateKey(k.id)} className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <RefreshCw className="h-4 w-4 mr-2" /> Rotate
          </Button>
          <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)} className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
            <ShieldOff className="h-4 w-4 mr-2" /> Revoke
          </Button>
        </div>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>API Keys & Secrets</PageTitle>
          <PageDescription>Manage Machine-to-Machine service tokens and Personal Access Tokens.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Generate New Key</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Key className="h-4 w-4"/> Active Keys</div>
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

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
import { ShieldCheck, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Role {
  id: string
  role_name: string
  description: string
  permissions: string[]
  created_at: string
}

export default function RolesPage() {
  const [data, setData] = React.useState<Role[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/roles?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch roles", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const columns: Column<Role>[] = [
    {
      key: "role_name",
      title: "Role Name",
      render: (r) => <span className="font-semibold">{r.role_name}</span>
    },
    {
      key: "description",
      title: "Description",
      render: (r) => <span className="text-sm text-muted-foreground">{r.description || "-"}</span>
    },
    {
      key: "permissions",
      title: "Permissions",
      render: (r) => (
        <div className="flex flex-wrap gap-1 max-w-[250px]">
          {r.permissions?.slice(0, 3).map(p => (
            <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
          ))}
          {r.permissions?.length > 3 && (
            <Badge variant="outline" className="text-xs">+{r.permissions.length - 3} more</Badge>
          )}
        </div>
      )
    },
    {
      key: "created_at",
      title: "Created",
      render: (r) => <span className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Roles & Access</PageTitle>
          <PageDescription>Define standard roles and their specific permission grants.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Create Role</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><ShieldCheck className="h-4 w-4"/> Total Roles</div>
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

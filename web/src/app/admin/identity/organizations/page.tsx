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
import { Building, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Organization {
  id: string
  name: string
  slug: string
  domain: string
  status: string
  created_at: string
}

export default function OrganizationsPage() {
  const [data, setData] = React.useState<Organization[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/organizations?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch organizations", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const columns: Column<Organization>[] = [
    {
      key: "name",
      title: "Organization Name",
      render: (org) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center font-bold text-primary">
            {org.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{org.name}</span>
            <span className="text-xs text-muted-foreground">{org.slug}</span>
          </div>
        </div>
      )
    },
    {
      key: "domain",
      title: "Domain",
    },
    {
      key: "status",
      title: "Status",
      render: (org) => (
        <Badge variant={org.status === "Active" ? "outline" : "secondary"} 
          className={org.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : ""}>
          {org.status}
        </Badge>
      )
    },
    {
      key: "created_at",
      title: "Created",
      render: (org) => <span className="text-sm text-muted-foreground">{new Date(org.created_at).toLocaleDateString()}</span>
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Organizations & Tenants</PageTitle>
          <PageDescription>Manage isolated enterprise organizations, workspaces, and tenants.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Create Organization</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Building className="h-4 w-4"/> Total Organizations</div>
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

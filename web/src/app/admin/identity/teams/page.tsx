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
import { Users, Plus, Network } from "lucide-react"

interface Team {
  id: string
  name: string
  description: string
  organization_id: string
  created_at: string
}

export default function TeamsPage() {
  const [data, setData] = React.useState<Team[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/teams?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch teams", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const columns: Column<Team>[] = [
    {
      key: "name",
      title: "Team Name",
      render: (t) => (
        <div className="flex items-center gap-3">
          <Network className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{t.name}</span>
        </div>
      )
    },
    {
      key: "description",
      title: "Description",
      render: (t) => <span className="text-sm text-muted-foreground">{t.description || "-"}</span>
    },
    {
      key: "created_at",
      title: "Created",
      render: (t) => <span className="text-sm text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Teams & Departments</PageTitle>
          <PageDescription>Manage nested organizational units, cross-functional teams, and managers.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2">Hierarchy View</Button>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Create Team</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Users className="h-4 w-4"/> Total Teams</div>
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

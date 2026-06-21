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
import { Plus, UserPlus, Shield, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  email: string
  username: string
  full_name: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login_at: string | null
}

export default function UsersPage() {
  const [data, setData] = React.useState<User[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/users?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch users", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const columns: Column<User>[] = [
    {
      key: "full_name",
      title: "Name",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
            {(u.full_name || u.email).charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{u.full_name || "Unknown"}</span>
            <span className="text-xs text-muted-foreground">{u.email}</span>
          </div>
        </div>
      )
    },
    {
      key: "username",
      title: "Username",
    },
    {
      key: "status",
      title: "Status",
      render: (u) => (
        <div className="flex gap-2">
          {u.is_active ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Suspended</Badge>
          )}
          {u.is_verified && <Badge variant="secondary" className="bg-blue-50 text-blue-700">Verified</Badge>}
        </div>
      )
    },
    {
      key: "created_at",
      title: "Joined",
      render: (u) => <span className="text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</span>
    },
    {
      key: "last_login_at",
      title: "Last Login",
      render: (u) => <span className="text-sm text-muted-foreground">{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never"}</span>
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Identity & Users</PageTitle>
          <PageDescription>Manage users, access controls, and identities across the ecosystem.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2"><Shield className="h-4 w-4" /> Security Audit</Button>
          <Button className="gap-2"><UserPlus className="h-4 w-4" /> Invite User</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><UserPlus className="h-4 w-4"/> Total Users</div>
          <div className="text-2xl font-bold">{total}</div>
        </div>
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-green-600 mb-2"><Activity className="h-4 w-4"/> Active Sessions</div>
          <div className="text-2xl font-bold">124</div>
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

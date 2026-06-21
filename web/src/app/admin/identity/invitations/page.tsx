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
import { Mail, Plus, XCircle, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Invitation {
  id: string
  email: string
  status: string
  organization_id: string | null
  role_id: string | null
  expires_at: string
  created_at: string
}

export default function InvitationsPage() {
  const [data, setData] = React.useState<Invitation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/invitations?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch invitations", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const cancelInvitation = async (id: string) => {
    if(!confirm("Are you sure you want to cancel this invitation?")) return
    try {
      await fetch(`/api/v1/admin/invitations/${id}/cancel`, { method: "POST" })
      fetchData(page, search)
    } catch (e) {
      console.error("Failed to cancel invitation", e)
    }
  }

  const columns: Column<Invitation>[] = [
    {
      key: "email",
      title: "Email",
      render: (i) => (
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{i.email}</span>
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (i) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
        let cls = ""
        if(i.status === "pending") {
          cls = "bg-yellow-50 text-yellow-700 border-yellow-200"
        } else if (i.status === "accepted") {
          cls = "bg-green-50 text-green-700 border-green-200"
        } else if (i.status === "cancelled" || i.status === "expired") {
          variant = "secondary"
        }
        return (
          <Badge variant={variant} className={cls}>
            {i.status.charAt(0).toUpperCase() + i.status.slice(1)}
          </Badge>
        )
      }
    },
    {
      key: "expires_at",
      title: "Expires",
      render: (i) => <span className="text-sm text-muted-foreground">{new Date(i.expires_at).toLocaleDateString()}</span>
    },
    {
      key: "created_at",
      title: "Sent",
      render: (i) => <span className="text-sm text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</span>
    },
    {
      key: "actions",
      title: "",
      render: (i) => i.status === "pending" && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8">
            <Send className="h-4 w-4 mr-2" /> Resend
          </Button>
          <Button variant="ghost" size="sm" onClick={() => cancelInvitation(i.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8">
            <XCircle className="h-4 w-4 mr-2" /> Cancel
          </Button>
        </div>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Invitations</PageTitle>
          <PageDescription>Manage pending user invites, bulk imports, and resend links.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2">Bulk Import (CSV)</Button>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Invite User</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Mail className="h-4 w-4"/> Total Sent</div>
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

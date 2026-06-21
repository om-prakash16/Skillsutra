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
import { CheckCircle2, XCircle, FileText, BadgeCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface VerificationRequest {
  id: string
  user_id: string
  verification_type: string
  status: string
  document_url: string | null
  reviewer_id: string | null
  reviewed_at: string | null
  created_at: string
}

export default function VerificationPage() {
  const [data, setData] = React.useState<VerificationRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const pageSize = 50

  const fetchData = async (currentPage: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/verification?page=${currentPage}&size=${pageSize}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch verifications", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page)
  }, [page])

  const approveRequest = async (id: string) => {
    if(!confirm("Approve this verification request?")) return
    try {
      await fetch(`/api/v1/admin/verification/${id}/approve`, { method: "POST" })
      fetchData(page)
    } catch (e) {
      console.error("Failed to approve", e)
    }
  }

  const rejectRequest = async (id: string) => {
    const reason = prompt("Reason for rejection:")
    if(!reason) return
    try {
      await fetch(`/api/v1/admin/verification/${id}/reject`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      })
      fetchData(page)
    } catch (e) {
      console.error("Failed to reject", e)
    }
  }

  const columns: Column<VerificationRequest>[] = [
    {
      key: "verification_type",
      title: "Type",
      render: (v) => (
        <div className="flex items-center gap-3">
          <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm capitalize">{v.verification_type}</span>
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (v) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
        let cls = ""
        if(v.status === "pending") cls = "bg-yellow-50 text-yellow-700 border-yellow-200"
        else if (v.status === "approved") cls = "bg-green-50 text-green-700 border-green-200"
        else if (v.status === "rejected") variant = "destructive"
        return (
          <Badge variant={variant} className={cls}>
            {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
          </Badge>
        )
      }
    },
    {
      key: "document",
      title: "Document",
      render: (v) => v.document_url ? (
        <a href={v.document_url} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline text-sm">
          <FileText className="h-4 w-4 mr-1" /> View Document
        </a>
      ) : <span className="text-muted-foreground text-sm">None provided</span>
    },
    {
      key: "created_at",
      title: "Submitted",
      render: (v) => <span className="text-sm text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</span>
    },
    {
      key: "actions",
      title: "",
      render: (v) => v.status === "pending" && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => approveRequest(v.id)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
            <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button variant="ghost" size="sm" onClick={() => rejectRequest(v.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <XCircle className="h-4 w-4 mr-1" /> Reject
          </Button>
        </div>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Verification Center</PageTitle>
          <PageDescription>Review and approve Government ID, Email, Phone, and Corporate verifications.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2">Pending Only</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><BadgeCheck className="h-4 w-4"/> Total Requests</div>
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

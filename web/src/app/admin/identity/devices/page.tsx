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
import { Laptop, XCircle, CheckCircle, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Device {
  id: string
  user_id: string
  device_name: string
  device_type: string
  os_name: string
  browser_name: string
  fingerprint: string
  last_ip_address: string
  is_trusted: boolean
  is_blocked: boolean
  last_active_at: string
  created_at: string
}

export default function DevicesPage() {
  const [data, setData] = React.useState<Device[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const pageSize = 50

  const fetchData = async (currentPage: number, currentSearch: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/devices?page=${currentPage}&size=${pageSize}&search=${currentSearch}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setTotal(json.meta?.total || 0)
      }
    } catch (e) {
      console.error("Failed to fetch devices", e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData(page, search)
  }, [page, search])

  const toggleTrust = async (id: string, currentTrust: boolean) => {
    try {
      await fetch(`/api/v1/admin/devices/${id}/trust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_trusted: !currentTrust })
      })
      fetchData(page, search)
    } catch (e) {
      console.error("Failed to toggle trust", e)
    }
  }

  const toggleBlock = async (id: string, currentBlock: boolean) => {
    if(!currentBlock && !confirm("Block this device? This will immediately terminate its sessions.")) return
    try {
      await fetch(`/api/v1/admin/devices/${id}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_blocked: !currentBlock })
      })
      fetchData(page, search)
    } catch (e) {
      console.error("Failed to toggle block", e)
    }
  }

  const columns: Column<Device>[] = [
    {
      key: "device_name",
      title: "Device / OS",
      render: (d) => (
        <div className="flex items-center gap-3">
          {d.device_type === "mobile" ? <Smartphone className="h-4 w-4 text-muted-foreground" /> : <Laptop className="h-4 w-4 text-muted-foreground" />}
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{d.device_name || "Unknown Device"}</span>
            <span className="text-xs text-muted-foreground">{d.os_name} • {d.browser_name}</span>
          </div>
        </div>
      )
    },
    {
      key: "fingerprint",
      title: "Fingerprint",
      render: (d) => <span className="font-mono text-xs text-muted-foreground" title={d.fingerprint}>{d.fingerprint.substring(0, 16)}...</span>
    },
    {
      key: "trust",
      title: "Trust Status",
      render: (d) => (
        <Badge variant={d.is_trusted ? "outline" : "secondary"} 
          className={d.is_trusted ? "bg-green-50 text-green-700 border-green-200" : ""}>
          {d.is_trusted ? "Trusted" : "Untrusted"}
        </Badge>
      )
    },
    {
      key: "status",
      title: "Block Status",
      render: (d) => (
        <Badge variant={d.is_blocked ? "destructive" : "outline"} 
          className={!d.is_blocked ? "bg-green-50 text-green-700 border-green-200" : ""}>
          {d.is_blocked ? "Blocked" : "Allowed"}
        </Badge>
      )
    },
    {
      key: "last_active",
      title: "Last Active",
      render: (d) => <span className="text-sm text-muted-foreground">{new Date(d.last_active_at).toLocaleString()}</span>
    },
    {
      key: "actions",
      title: "",
      render: (d) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => toggleTrust(d.id, d.is_trusted)} className="h-8">
            <CheckCircle className="h-4 w-4 mr-2" /> {d.is_trusted ? "Untrust" : "Trust"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toggleBlock(d.id, d.is_blocked)} 
            className={d.is_blocked ? "text-green-600 hover:text-green-700 hover:bg-green-50 h-8" : "text-red-500 hover:text-red-600 hover:bg-red-50 h-8"}>
            <XCircle className="h-4 w-4 mr-2" /> {d.is_blocked ? "Unblock" : "Block"}
          </Button>
        </div>
      )
    }
  ]

  return (
    <EnterprisePageLayout>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Device Center</PageTitle>
          <PageDescription>Audit physical and virtual devices, manage trust relationships, and block compromised fingerprints.</PageDescription>
        </PageHeader>
        <ActionBar>
          <Button variant="outline" className="gap-2">Export Devices</Button>
        </ActionBar>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Laptop className="h-4 w-4"/> Registered Devices</div>
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

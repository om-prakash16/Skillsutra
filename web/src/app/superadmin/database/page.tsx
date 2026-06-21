"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api/api-client"
import { motion, AnimatePresence } from "framer-motion"
import {
    Database,
    Table2,
    Loader2,
    Search,
    ChevronDown,
    RefreshCw,
    Download,
    Terminal,
    AlertCircle
} from "lucide-react"
import { toast } from "sonner"

const TABLES = [
    "users",
    "companies",
    "jobs",
    "applications",
    "roles",
    "user_roles",
    "profiles",
    "audit_logs",
    "feature_flags",
]

export default function DatabaseConsolePage() {
    const [selectedTable, setSelectedTable] = useState<string>("users")
    const [data, setData] = useState<any[]>([])
    const [count, setCount] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("")

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            // Note: Use the existing db proxy endpoint if available, or fall back to mock
            const res = await api.get(`/db/${selectedTable}?limit=50`)
            if (res && res.data) {
                setData(res.data)
                setCount(res.count || res.data.length)
            } else if (Array.isArray(res)) {
                setData(res)
                setCount(res.length)
            } else {
                setData([])
                setCount(0)
            }
        } catch (err) {
            console.error("Failed to fetch table data", err)
            // Mock data fallback for UI development
            toast.error(`Unable to connect to table ${selectedTable}`)
            setData([])
            setCount(0)
        } finally {
            setLoading(false)
        }
    }, [selectedTable])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns = data.length > 0 ? Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object') : []

    const handleExport = () => {
        if (data.length === 0) return
        
        const headers = columns.join(",")
        const rows = data.map(row => 
            columns.map(col => {
                const val = row[col]
                if (val === null || val === undefined) return '""'
                return `"${String(val).replace(/"/g, '""')}"`
            }).join(",")
        ).join("\n")
        
        const csv = `${headers}\n${rows}`
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('download', `${selectedTable}_export.csv`)
        a.click()
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 shrink-0">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(113,113,122,0.8)]" />
                        <Badge variant="outline" className="glass border-zinc-500/30 text-zinc-400 px-4 font-black tracking-widest text-[9px] uppercase rounded-full">
                            Raw Data Access
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
                        Database <span className="text-zinc-500">Console</span>
                    </h1>
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        onClick={handleExport}
                        disabled={data.length === 0}
                        variant="outline"
                        className="rounded-xl font-bold gap-2 px-4 h-11 glass border-border hover:border-zinc-500/30 hover:bg-zinc-500/10 hover:text-zinc-400"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                    <Button 
                        onClick={fetchData} 
                        disabled={loading}
                        className="rounded-xl font-bold bg-zinc-700 hover:bg-zinc-600 text-white gap-2 px-6 h-11"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Run Query
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Sidebar Tables List */}
                <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border/30 bg-muted/20 shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search tables..."
                                className="pl-10 pr-4 py-2 w-full h-9 rounded-xl bg-background/50 border border-border text-sm text-foreground focus:outline-none focus:border-zinc-500/50"
                            />
                        </div>
                    </div>
                    <div className="p-2 overflow-y-auto custom-scrollbar flex-1 space-y-1">
                        {TABLES.map(table => (
                            <button
                                key={table}
                                onClick={() => setSelectedTable(table)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left ${
                                    selectedTable === table 
                                        ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20' 
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Table2 className="w-4 h-4 shrink-0" />
                                    <span className="text-xs font-bold font-mono truncate">{table}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Table View */}
                <Card className="glass border-border/50 rounded-[1.5rem] overflow-hidden md:col-span-3 flex flex-col">
                    <div className="p-4 border-b border-border/30 bg-zinc-950/40 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-zinc-500" />
                            <div className="text-sm font-mono text-zinc-300">
                                SELECT * FROM <span className="text-amber-400">{selectedTable}</span> LIMIT 50;
                            </div>
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px] text-zinc-400 border-zinc-700 bg-zinc-900">
                            {count} rows
                        </Badge>
                    </div>
                    
                    <div className="flex-1 overflow-auto bg-zinc-950 custom-scrollbar relative">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm z-10">
                                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                            </div>
                        ) : data.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-3">
                                <AlertCircle className="w-12 h-12 opacity-20" />
                                <p className="text-sm font-mono uppercase tracking-widest">No rows returned</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-xs font-mono text-zinc-400 whitespace-nowrap">
                                <thead className="sticky top-0 bg-zinc-900 shadow-md">
                                    <tr>
                                        {columns.map(col => (
                                            <th key={col} className="px-4 py-3 font-bold text-zinc-300 border-b border-zinc-800 tracking-wider">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, i) => (
                                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                                            {columns.map(col => (
                                                <td key={col} className="px-4 py-2.5 max-w-[200px] truncate">
                                                    {row[col] === null ? (
                                                        <span className="text-zinc-600 italic">null</span>
                                                    ) : typeof row[col] === 'boolean' ? (
                                                        <span className={row[col] ? "text-emerald-400" : "text-rose-400"}>{String(row[col])}</span>
                                                    ) : (
                                                        String(row[col])
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}

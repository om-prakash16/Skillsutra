"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, GitMerge, Trash, ArrowRight } from "lucide-react"

export default function RedirectsManagerPage() {
    const [redirects, setRedirects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Mock fetch for now, will connect to /api/v1/superadmin/delivery/redirects
        setTimeout(() => {
            setRedirects([
                { id: "1", source: "/old-about", destination: "/about", status: 301 },
                { id: "2", source: "/careers/engineering", destination: "/jobs/engineering", status: 301 },
                { id: "3", source: "/promo-2025", destination: "/pricing", status: 302 },
            ])
            setIsLoading(false)
        }, 800)
    }, [])

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        <GitMerge className="h-8 w-8 text-orange-500" /> Redirects Engine
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage 301 and 302 redirects to preserve SEO juice and prevent 404s.</p>
                </div>
                <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4" /> Add Redirect
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>URL Redirects</CardTitle>
                            <CardDescription>Rules are evaluated before dynamic route resolution.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search redirects..." className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-40 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-4 py-3 w-5/12">Source Path</th>
                                        <th className="px-4 py-3 w-1/12 text-center">Type</th>
                                        <th className="px-4 py-3 w-5/12">Destination</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {redirects.map((redirect) => (
                                        <tr key={redirect.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium">
                                                <div className="bg-muted px-2 py-1 rounded text-xs font-mono inline-block">
                                                    {redirect.source}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${redirect.status === 301 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {redirect.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <ArrowRight className="h-3 w-3" />
                                                    <span className="font-mono text-xs text-foreground bg-primary/10 px-2 py-1 rounded">
                                                        {redirect.destination}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-500">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

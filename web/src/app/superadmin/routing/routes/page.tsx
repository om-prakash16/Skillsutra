"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Route as RouteIcon, ExternalLink, Pencil, Trash } from "lucide-react"

export default function RouteManagerPage() {
    const [routes, setRoutes] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Mock fetch for now, will connect to /api/v1/superadmin/delivery/routes
        setTimeout(() => {
            setRoutes([
                { id: "1", path: "/about", entity_type: "cms_page", is_active: true, locale: "en" },
                { id: "2", path: "/careers", entity_type: "cms_page", is_active: true, locale: "en" },
                { id: "3", path: "/blog/what-is-ai", entity_type: "cms_entry", is_active: true, locale: "en" },
                { id: "4", path: "/pricing", entity_type: "cms_page", is_active: false, locale: "en" },
            ])
            setIsLoading(false)
        }, 800)
    }, [])

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        <RouteIcon className="h-8 w-8 text-primary" /> Route Manager
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage all active dynamic URLs on the platform.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Route
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Dynamic Routes</CardTitle>
                            <CardDescription>URLs mapped to CMS content or components</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search routes..." className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-40 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted text-muted-foreground uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Path</th>
                                        <th className="px-4 py-3">Entity Type</th>
                                        <th className="px-4 py-3">Locale</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {routes.map((route) => (
                                        <tr key={route.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium flex items-center gap-2">
                                                <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-mono">
                                                    {route.path}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                <span className="bg-muted px-2 py-1 rounded-md text-xs">{route.entity_type}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="uppercase text-xs font-bold">{route.locale}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {route.is_active ? (
                                                    <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-medium">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-muted-foreground text-xs font-medium">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span> Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-500">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
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

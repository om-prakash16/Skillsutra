"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Route, Search, Globe, GitMerge, AlertCircle, ArrowUpRight, Link as LinkIcon, AlertTriangle } from "lucide-react"

export default function RoutingDashboardPage() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Routing & Delivery Engine</h1>
                <p className="text-muted-foreground mt-2">Enterprise Control Center for URLs, Domains, SEO, and Navigation.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary/5 border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Route className="h-24 w-24" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium">Total Dynamic Routes</CardTitle>
                        <Route className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-black text-primary">1,482</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +14 since last week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">24</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            3 pending SSL provisioning
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Redirects</CardTitle>
                        <GitMerge className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">3,192</div>
                        <p className="text-xs text-muted-foreground mt-1 text-emerald-500">
                            99.9% resolution rate
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-rose-500/20 bg-rose-500/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-rose-500">404 Errors (24h)</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-rose-500">142</div>
                        <p className="text-xs text-rose-500/80 mt-1">
                            Review logs to map redirects
                        </p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Delivery Traffic Overview</CardTitle>
                        <CardDescription>Edge resolution performance across all tenant domains</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border mx-6 mb-6">
                        <div className="flex flex-col items-center text-muted-foreground">
                            <BarChart3 className="h-10 w-10 mb-2 opacity-50" />
                            <p className="text-sm font-medium">Traffic visualization module loading...</p>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Links</CardTitle>
                        <CardDescription>Common routing tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center p-3 bg-muted/50 rounded-xl hover:bg-muted/80 cursor-pointer transition-colors group">
                            <div className="bg-primary/10 p-2 rounded-lg mr-3 group-hover:bg-primary/20 transition-colors">
                                <Route className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Map New Route</p>
                                <p className="text-xs text-muted-foreground">Connect a URL to a CMS entity</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-muted/50 rounded-xl hover:bg-muted/80 cursor-pointer transition-colors group">
                            <div className="bg-orange-500/10 p-2 rounded-lg mr-3 group-hover:bg-orange-500/20 transition-colors">
                                <GitMerge className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Add Redirect</p>
                                <p className="text-xs text-muted-foreground">Map an old slug to a new one</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-muted/50 rounded-xl hover:bg-muted/80 cursor-pointer transition-colors group">
                            <div className="bg-blue-500/10 p-2 rounded-lg mr-3 group-hover:bg-blue-500/20 transition-colors">
                                <Globe className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Domain Binding</p>
                                <p className="text-xs text-muted-foreground">Attach a custom domain to a tenant</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-muted/50 rounded-xl hover:bg-muted/80 cursor-pointer transition-colors group">
                            <div className="bg-emerald-500/10 p-2 rounded-lg mr-3 group-hover:bg-emerald-500/20 transition-colors">
                                <Search className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Global SEO Settings</p>
                                <p className="text-xs text-muted-foreground">Manage robots.txt and sitemaps</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

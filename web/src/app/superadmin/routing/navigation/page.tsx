"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation, Plus, GripVertical, Settings2, Trash2, Edit } from "lucide-react"

export default function NavigationManagerPage() {
    const [menus] = useState([
        { id: "1", name: "Main Header", slug: "main-header", items: 5 },
        { id: "2", name: "Footer Legal", slug: "footer-legal", items: 3 },
        { id: "3", name: "Sidebar Docs", slug: "sidebar-docs", items: 12 },
    ])

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        <Navigation className="h-8 w-8 text-blue-500" /> Navigation Manager
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage all menus, headers, and footers across domains.</p>
                </div>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Create Menu
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 border-r shadow-none rounded-xl">
                    <CardHeader>
                        <CardTitle>Global Menus</CardTitle>
                        <CardDescription>Select a menu to edit its items</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex flex-col divide-y divide-border border-t">
                            {menus.map((menu, idx) => (
                                <div key={menu.id} className={`p-4 cursor-pointer transition-colors ${idx === 0 ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : 'hover:bg-muted/50'}`}>
                                    <div className="font-bold flex items-center justify-between">
                                        {menu.name}
                                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{menu.items} items</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 font-mono">slug: {menu.slug}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 shadow-none rounded-xl">
                    <CardHeader className="border-b bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    Main Header <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">main-header</span>
                                </CardTitle>
                                <CardDescription className="mt-1">Drag and drop to reorder navigation items</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" /> Add Item
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {/* Mock Tree */}
                            {[
                                { label: "Features", route: "/features", children: 2 },
                                { label: "Pricing", route: "/pricing", children: 0 },
                                { label: "Resources", route: "/resources", children: 4 },
                                { label: "Company", route: "/about", children: 0 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-background border rounded-lg shadow-sm group">
                                    <GripVertical className="h-5 w-5 text-muted-foreground/30 cursor-grab active:cursor-grabbing hover:text-foreground transition-colors" />
                                    <div className="flex-1">
                                        <div className="font-bold text-sm">{item.label}</div>
                                        <div className="text-xs font-mono text-muted-foreground mt-0.5">{item.route}</div>
                                    </div>
                                    {item.children > 0 && (
                                        <div className="text-xs font-medium bg-muted px-2 py-1 rounded-md text-muted-foreground">
                                            {item.children} children
                                        </div>
                                    )}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

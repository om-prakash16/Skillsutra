"use client";

import { useState } from "react";
import { Users, Filter, Plus, ShieldAlert, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MembersManagementPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Members</h1>
          <p className="text-muted-foreground">Manage global members, scopes, and RBAC assignments.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Provision Member
        </Button>
      </div>

      {isCreating && (
        <Card className="border-primary/50 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Provision New Member</CardTitle>
            <CardDescription>Create an identity and explicitly assign its boundaries.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Identity Details</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input placeholder="johndoe" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Role & Scope</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">RBAC Role Template</label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      <option>Platform Admin</option>
                      <option>Tenant Admin</option>
                      <option>Moderator</option>
                      <option>Support Staff</option>
                      <option>Internal Member</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Boundary Scope</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Button variant="outline" type="button" className="justify-start gap-2 h-10 border-primary bg-primary/5">
                        <ShieldAlert className="w-4 h-4 text-primary" /> Platform Wide
                      </Button>
                      <Button variant="outline" type="button" className="justify-start gap-2 h-10 text-muted-foreground">
                        <Building2 className="w-4 h-4" /> Specific Tenant
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Tenant ID</label>
                    <Input placeholder="Enter UUID or leave blank for platform-wide" disabled />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" type="button" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="button">Provision Identity</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search members..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium">User</th>
                <th className="p-4 text-left font-medium">Role</th>
                <th className="p-4 text-left font-medium">Scope</th>
                <th className="p-4 text-center font-medium">Status</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-4">
                  <div className="font-medium">Admin User</div>
                  <div className="text-xs text-muted-foreground">admin@platform.com</div>
                </td>
                <td className="p-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full font-medium">Super Admin</span></td>
                <td className="p-4 font-mono text-xs">Global Platform</td>
                <td className="p-4 text-center"><span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">Active</span></td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
              <tr className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-4">
                  <div className="font-medium">Tenant Owner</div>
                  <div className="text-xs text-muted-foreground">owner@tenant.com</div>
                </td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full font-medium">Tenant Admin</span></td>
                <td className="p-4 font-mono text-xs">t_582910fa</td>
                <td className="p-4 text-center"><span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">Active</span></td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_PERMISSIONS = [
  { resource: "users", actions: ["view", "create", "edit", "delete"] },
  { resource: "tenants", actions: ["view", "create", "edit", "delete"] },
  { resource: "roles", actions: ["view", "create", "edit", "delete"] },
  { resource: "content", actions: ["view", "create", "edit", "delete", "publish"] },
  { resource: "audit_logs", actions: ["view", "export"] },
];

const MOCK_ROLES = [
  { id: "1", name: "Super Admin", description: "Full platform access", is_template: true, permissions: ["superadmin:all"] },
  { id: "2", name: "Platform Admin", description: "Manage assigned tenants", is_template: true, permissions: ["view:users", "edit:users", "view:tenants"] },
  { id: "3", name: "Moderator", description: "Review and moderate content", is_template: true, permissions: ["view:content", "edit:content", "publish:content"] },
];

export default function RolesManagementPage() {
  const [selectedRole, setSelectedRole] = useState(MOCK_ROLES[0]);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Role Templates & Permissions</h1>
        <p className="text-muted-foreground">Manage RBAC policies, create custom roles, and define strict capability scopes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Templates</h2>
            <Button size="sm" variant="ghost" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {MOCK_ROLES.map((role) => (
              <Card 
                key={role.id} 
                className={`cursor-pointer transition-colors hover:border-primary ${selectedRole.id === role.id ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => { setSelectedRole(role); setIsCreating(false); }}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    {role.name}
                  </CardTitle>
                  <CardDescription className="text-xs">{role.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{isCreating ? "Create New Role" : selectedRole.name}</CardTitle>
                <CardDescription>
                  {isCreating ? "Define a new custom role and set its capabilities." : "Modify permissions for this role template."}
                </CardDescription>
              </div>
              {!isCreating && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" /> Clone Template
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {isCreating && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role Name</label>
                    <Input placeholder="e.g. Support Specialist" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input placeholder="What can this role do?" />
                  </div>
                </div>
              )}

              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Resource</th>
                      <th className="p-3 text-center font-medium">View</th>
                      <th className="p-3 text-center font-medium">Create</th>
                      <th className="p-3 text-center font-medium">Edit</th>
                      <th className="p-3 text-center font-medium">Delete</th>
                      <th className="p-3 text-center font-medium">Special</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEFAULT_PERMISSIONS.map((resource) => (
                      <tr key={resource.resource} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3 capitalize font-medium">{resource.resource.replace("_", " ")}</td>
                        {["view", "create", "edit", "delete"].map((action) => {
                          const permStr = `${action}:${resource.resource}`;
                          const hasAction = resource.actions.includes(action);
                          const isGranted = selectedRole.permissions.includes(permStr) || selectedRole.permissions.includes("superadmin:all");
                          
                          return (
                            <td key={action} className="p-3 text-center">
                              {hasAction ? (
                                <input 
                                  type="checkbox" 
                                  checked={isGranted}
                                  readOnly
                                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              ) : <span className="text-muted-foreground">-</span>}
                            </td>
                          );
                        })}
                        <td className="p-3 text-center">
                          {resource.actions.filter(a => !["view", "create", "edit", "delete"].includes(a)).map(special => (
                            <div key={special} className="flex items-center justify-center gap-2">
                              <input 
                                type="checkbox" 
                                checked={selectedRole.permissions.includes(`${special}:${resource.resource}`) || selectedRole.permissions.includes("superadmin:all")}
                                readOnly
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-xs capitalize">{special}</span>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

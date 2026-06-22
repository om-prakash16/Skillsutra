"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Building2, Loader2 } from "lucide-react"
import { api } from "@/lib/api/api-client"

const tenantSchema = z.object({
    tenantName: z.string().min(2, "Tenant Name must be at least 2 characters"),
    tenantSlug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
    companyName: z.string().min(2, "Company Name is required"),
    plan: z.enum(["trial", "startup", "business", "enterprise", "government", "education"]),
    ownerEmail: z.string().email("Valid owner email is required"),
})

type TenantFormValues = z.infer<typeof tenantSchema>

interface Props {
    onSuccess: () => void
}

export function CreateTenantForm({ onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<TenantFormValues>({
        resolver: zodResolver(tenantSchema),
        defaultValues: {
            tenantName: "",
            tenantSlug: "",
            companyName: "",
            plan: "trial",
            ownerEmail: "",
        }
    })

    const onSubmit = async (data: TenantFormValues) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await api.post("/superadmin/quick-actions/tenants", data)
            onSuccess()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                </div>
            )}
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Tenant Name</Label>
                    <Input {...form.register("tenantName")} placeholder="Acme Corp" />
                    {form.formState.errors.tenantName && (
                        <p className="text-xs text-red-500">{form.formState.errors.tenantName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Tenant Slug</Label>
                    <Input {...form.register("tenantSlug")} placeholder="acme-corp" />
                    <p className="text-[10px] text-muted-foreground">Used for URLs (e.g., acme-corp.skillsutra.com)</p>
                    {form.formState.errors.tenantSlug && (
                        <p className="text-xs text-red-500">{form.formState.errors.tenantSlug.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input {...form.register("companyName")} placeholder="Acme Corporation Ltd." />
                    {form.formState.errors.companyName && (
                        <p className="text-xs text-red-500">{form.formState.errors.companyName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Subscription Plan</Label>
                    <select 
                        {...form.register("plan")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="trial">Trial</option>
                        <option value="startup">Startup</option>
                        <option value="business">Business</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="government">Government</option>
                        <option value="education">Education</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Owner Email</Label>
                    <Input {...form.register("ownerEmail")} type="email" placeholder="admin@acmecorp.com" />
                    <p className="text-[10px] text-muted-foreground">The initial Tenant Admin will be created with this email.</p>
                    {form.formState.errors.ownerEmail && (
                        <p className="text-xs text-red-500">{form.formState.errors.ownerEmail.message}</p>
                    )}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                    Provision Tenant
                </Button>
            </div>
        </form>
    )
}

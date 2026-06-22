"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from "lucide-react"
import { api } from "@/lib/api/api-client"

const userSchema = z.object({
    email: z.string().email("Valid email is required"),
    fullName: z.string().min(2, "Full Name is required"),
    role: z.enum(["employee", "recruiter", "hr", "finance", "developer", "marketing", "sales", "mentor", "student", "admin", "talent", "other"]),
    tenantId: z.string().min(1, "Tenant ID is required (use 'global' for unassigned)"),
})

type UserFormValues = z.infer<typeof userSchema>

interface Props {
    onSuccess: () => void
}

export function CreateUserForm({ onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: "",
            fullName: "",
            role: "employee",
            tenantId: "global",
        }
    })

    const onSubmit = async (data: UserFormValues) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await api.post("/superadmin/quick-actions/users", data)
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
                    <Label>Email Address</Label>
                    <Input {...form.register("email")} type="email" placeholder="user@example.com" />
                    {form.formState.errors.email && (
                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input {...form.register("fullName")} placeholder="John Doe" />
                    {form.formState.errors.fullName && (
                        <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Role</Label>
                    <select 
                        {...form.register("role")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="admin">Admin</option>
                        <option value="talent">Talent</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="employee">Employee</option>
                        <option value="hr">HR Professional</option>
                        <option value="developer">Developer</option>
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Target Tenant ID</Label>
                    <Input {...form.register("tenantId")} placeholder="e.g. uuid-of-tenant or 'global'" />
                    <p className="text-[10px] text-muted-foreground">Assigns the user to a specific tenant workspace.</p>
                    {form.formState.errors.tenantId && (
                        <p className="text-xs text-red-500">{form.formState.errors.tenantId.message}</p>
                    )}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Create Identity
                </Button>
            </div>
        </form>
    )
}

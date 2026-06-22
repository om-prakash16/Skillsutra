"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ShieldAlert, Loader2 } from "lucide-react"
import { api } from "@/lib/api/api-client"

const adminSchema = z.object({
    fullName: z.string().min(2, "Full Name is required"),
    email: z.string().email("Valid email is required"),
    username: z.string().min(3, "Username required"),
    department: z.string().min(2, "Department required"),
})

type AdminFormValues = z.infer<typeof adminSchema>

interface Props {
    onSuccess: () => void
}

export function CreatePlatformAdminForm({ onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<AdminFormValues>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
            fullName: "",
            email: "",
            username: "",
            department: "Engineering",
        }
    })

    const onSubmit = async (data: AdminFormValues) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await api.post("/superadmin/quick-actions/platform-admins", data)
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
                    <Label>Full Name</Label>
                    <Input {...form.register("fullName")} placeholder="Jane Doe" />
                    {form.formState.errors.fullName && (
                        <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input {...form.register("email")} type="email" placeholder="jane@platform.com" />
                    {form.formState.errors.email && (
                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Username</Label>
                    <Input {...form.register("username")} placeholder="jane.doe" />
                    {form.formState.errors.username && (
                        <p className="text-xs text-red-500">{form.formState.errors.username.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Department</Label>
                    <Input {...form.register("department")} placeholder="Security, Engineering, etc." />
                    {form.formState.errors.department && (
                        <p className="text-xs text-red-500">{form.formState.errors.department.message}</p>
                    )}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                    Provision Admin
                </Button>
            </div>
        </form>
    )
}

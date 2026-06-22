"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Megaphone, Loader2 } from "lucide-react"
import { api } from "@/lib/api/api-client"

const announcementSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    type: z.enum(["platform", "maintenance", "security", "incident", "release", "emergency"]),
    audience: z.enum(["entire-platform", "selected-tenants"]),
})

type AnnouncementFormValues = z.infer<typeof announcementSchema>

interface Props {
    onSuccess: () => void
}

export function PublishAnnouncementForm({ onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<AnnouncementFormValues>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: "",
            message: "",
            type: "platform",
            audience: "entire-platform",
        }
    })

    const onSubmit = async (data: AnnouncementFormValues) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await api.post("/superadmin/quick-actions/announcements", data)
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
                    <Label>Announcement Title</Label>
                    <Input {...form.register("title")} placeholder="e.g. Scheduled Maintenance Notice" />
                    {form.formState.errors.title && (
                        <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Message Body (Markdown supported)</Label>
                    <Textarea 
                        {...form.register("message")} 
                        placeholder="Detail the announcement here..."
                        className="min-h-[150px] resize-y"
                    />
                    {form.formState.errors.message && (
                        <p className="text-xs text-red-500">{form.formState.errors.message.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <select 
                            {...form.register("type")}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="platform">Platform Update</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="security">Security Advisory</option>
                            <option value="incident">Incident Report</option>
                            <option value="emergency">Emergency Broadcast</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Audience</Label>
                        <select 
                            {...form.register("audience")}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="entire-platform">Entire Platform (All Users)</option>
                            <option value="selected-tenants">Selected Tenants</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                    Broadcast Now
                </Button>
            </div>
        </form>
    )
}

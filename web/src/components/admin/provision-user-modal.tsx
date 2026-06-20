"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api/api-client"
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react"

interface ProvisionUserModalProps {
    role: "admin" | "mentor" | "moderator"
    trigger: React.ReactNode
    onSuccess?: () => void
}

export function ProvisionUserModal({ role, trigger, onSuccess }: ProvisionUserModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: ""
    })

    const roleDisplayNames = {
        admin: "Administrator",
        mentor: "Mentor",
        moderator: "Moderator"
    }

    const resetForm = () => {
        setFormData({ email: "", first_name: "", last_name: "" })
        setError("")
        setSuccess(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setTimeout(resetForm, 300)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await api.post("/admin/users/provision", {
                ...formData,
                role_name: role
            })
            setSuccess(true)
            if (onSuccess) {
                onSuccess()
            }
            setTimeout(() => {
                setOpen(false)
                setTimeout(resetForm, 300)
            }, 2000)
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || "Failed to provision user")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass border-border/50 rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Provision {roleDisplayNames[role]}
                    </DialogTitle>
                    <DialogDescription>
                        Enter the details to provision a new {roleDisplayNames[role].toLowerCase()} or grant this role to an existing user.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-500">Provisioned Successfully</h3>
                        <p className="text-sm text-muted-foreground text-center">
                            The user has been successfully assigned the {role} role.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-rose-500">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="bg-background/50"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    value={formData.first_name}
                                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    value={formData.last_name}
                                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                    className="bg-background/50"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                {error}
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="gap-2">
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Provision User
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

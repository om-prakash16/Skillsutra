"use client"

import { useState } from "react"
import { UserProfile, Certification } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Calendar, Link as LinkIcon, Loader2, Plus, X } from "lucide-react"

interface Props {
    data: UserProfile
    onSave: (payload: any) => Promise<void>
}

export function CertificationsTab({ data, onSave }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [certifications, setCertifications] = useState<Certification[]>(data.certifications || [])
    const [isAdding, setIsAdding] = useState(false)

    const [newCert, setNewCert] = useState<Partial<Certification>>({
        name: "",
        issuer: "",
        issue_date: "",
        expiration_date: "",
        credential_id: "",
        credential_url: ""
    })

    const handleSave = async (updatedCerts: Certification[]) => {
        setIsLoading(true)
        // Send the latest added certification
        // For simplicity we just send the newly added one. The backend adds it to DB.
        const lastAdded = updatedCerts[updatedCerts.length - 1]
        await onSave({
            type: "certification",
            data: lastAdded
        })
        setIsLoading(false)
        setIsAdding(false)
        setNewCert({
            name: "",
            issuer: "",
            issue_date: "",
            expiration_date: "",
            credential_id: "",
            credential_url: ""
        })
    }

    const handleAdd = () => {
        if (!newCert.name || !newCert.issuer || !newCert.issue_date) return
        
        const certToAdd = { ...newCert, id: Math.random().toString() } as Certification
        const updated = [...certifications, certToAdd]
        setCertifications(updated)
        handleSave(updated)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Certifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">Showcase your professional licenses and certificates.</p>
                </div>
                {onSave && (
                    <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"} className="gap-2">
                        {isAdding ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4" />}
                        {isAdding ? "Cancel" : "Add Certification"}
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Certification Name *</Label>
                                <Input placeholder="e.g. AWS Certified Solutions Architect" value={newCert.name} onChange={(e) => setNewCert({...newCert, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Issuing Organization *</Label>
                                <Input placeholder="e.g. Amazon Web Services" value={newCert.issuer} onChange={(e) => setNewCert({...newCert, issuer: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Issue Date *</Label>
                                <Input type="date" value={newCert.issue_date} onChange={(e) => setNewCert({...newCert, issue_date: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Expiration Date (Optional)</Label>
                                <Input type="date" value={newCert.expiration_date} onChange={(e) => setNewCert({...newCert, expiration_date: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Credential ID</Label>
                                <Input placeholder="e.g. AZ-123456" value={newCert.credential_id} onChange={(e) => setNewCert({...newCert, credential_id: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Credential URL</Label>
                                <Input placeholder="https://..." value={newCert.credential_url} onChange={(e) => setNewCert({...newCert, credential_url: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button onClick={handleAdd} disabled={!newCert.name || !newCert.issuer || !newCert.issue_date || isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                                Save Certification
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.length === 0 && !isAdding && onSave && (
                    <div className="col-span-full py-12 text-center border rounded-2xl border-dashed">
                        <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h4 className="text-lg font-medium">No Certifications</h4>
                        <p className="text-muted-foreground">Add your professional certifications to stand out.</p>
                    </div>
                )}
                {certifications.map(cert => (
                    <Card key={cert.id} className="glass">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-lg leading-tight">{cert.name}</h4>
                                    <p className="text-muted-foreground font-medium">{cert.issuer}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Award className="w-5 h-5" />
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-border/50 space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                                    {cert.expiration_date && <span> • Expires: {new Date(cert.expiration_date).toLocaleDateString()}</span>}
                                </div>
                                {cert.credential_id && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">ID:</span> {cert.credential_id}
                                    </div>
                                )}
                                {cert.credential_url && (
                                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline mt-2 inline-flex font-medium">
                                        <LinkIcon className="w-4 h-4" /> Verify Credential
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { fetchWithAuth } from "@/lib/api/api-client"
import { toast } from "sonner"

interface SaveTalentButtonProps {
    talentId: string
    companyId?: string // If not provided, we can fetch from user's current company
    className?: string
}

export function SaveTalentButton({ talentId, companyId, className }: SaveTalentButtonProps) {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    // Usually, we'd check if this talent is already saved in a useQuery
    // For now, we'll implement the UI logic to toggle

    const handleSave = async () => {
        if (!user) {
            toast.error("Please login to save talent.")
            return
        }

        // Ideally, companyId comes from the context of the logged-in company user
        const cId = companyId || user.companies?.[0]?.id

        if (!cId) {
            toast.error("Company profile required to save talent.")
            return
        }

        setIsLoading(true)
        try {
            if (isSaved) {
                await fetchWithAuth(`/company/${cId}/unsave/${talentId}`, { method: "DELETE" })
                toast.success("Talent removed from your pool.")
                setIsSaved(false)
            } else {
                await fetchWithAuth(`/talent-pool/${cId}/save`, { method: "POST", body: JSON.stringify({ talent_id: talentId }) })
                toast.success("Talent saved for future roles!")
                setIsSaved(true)
            }
        } catch (error) {
            console.error(error)
            toast.error("Operation failed. Try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (user?.role !== "company") {
        return null // Only companies can save talent
    }

    return (
        <Button
            variant={isSaved ? "premium" : "outline"}
            size="icon"
            className={`h-10 w-10 rounded-xl transition-all duration-300 ${isSaved ? "shadow-lg shadow-primary/20" : "hover:border-primary/50"} ${className}`}
            onClick={(e) => {
                e.preventDefault() // prevent navigating if inside a Link
                e.stopPropagation()
                handleSave()
            }}
            disabled={isLoading}
            title={isSaved ? "Remove from Talent Pool" : "Save for Future Jobs"}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            )}
        </Button>
    )
}

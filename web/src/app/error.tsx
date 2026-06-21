"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Route Segment Error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[400px] border-2 border-dashed border-border rounded-xl bg-muted/20">
      <div className="bg-destructive/10 p-3 rounded-full mb-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        This specific page or component failed to load. The rest of the platform is still functional.
      </p>
      
      <div className="bg-background p-3 rounded-lg max-w-lg w-full mb-6 border font-mono text-xs overflow-auto text-muted-foreground">
         {error.message || "Component Rendering Error"}
      </div>

      <Button onClick={() => reset()} variant="outline" className="gap-2">
        <RotateCcw className="h-4 w-4" /> Try Again
      </Button>
    </div>
  )
}

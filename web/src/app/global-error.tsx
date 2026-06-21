"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or OpenTelemetry
    console.error("Global Exception Captured:", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <div className="bg-destructive/10 p-4 rounded-full mb-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-center">System Error</h1>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            An unexpected error occurred within the platform. Our engineering team has been notified.
          </p>
          
          <div className="bg-muted p-4 rounded-xl max-w-lg w-full mb-8 border font-mono text-sm overflow-auto text-muted-foreground">
             {error.message || "Unknown Application Error"}
             {error.digest && <div className="mt-2 text-xs opacity-50">Digest: {error.digest}</div>}
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => reset()} variant="default" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Try Again
            </Button>
            <Link href="/superadmin/dashboard">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" /> Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}

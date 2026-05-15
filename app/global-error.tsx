"use client"

// Global error boundary for the Wisdom app.
// Audit pass XIII (2026-05-15): added because there was no app/error.tsx —
// production crashes were showing the default Next.js error page (with the
// "Application error: a server-side exception has occurred" banner) which
// isn't on-brand and gives users zero recourse.
//
// This component receives any uncaught error from a Server Component or
// during render, logs it client-side (for Sentry/PostHog wiring later),
// and offers a retry path.

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface to telemetry — currently console only; wire to Sentry/PostHog
    // when we have a project key. The error.digest is the stable hash Next
    // attaches in production so this can be cross-referenced to logs.
    console.error("[Wisdom] Uncaught error:", error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md flex flex-col gap-4 items-start">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wider">Something went wrong</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            We hit an error rendering this page.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            It's been logged. You can try again, or head back to the home page.
            If this keeps happening, the error reference below helps us trace it.
          </p>
          {error.digest && (
            <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
              ref: {error.digest}
            </code>
          )}
          <div className="flex gap-2 mt-2">
            <Button onClick={reset} variant="default" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </Button>
            <Link href="/">
              <Button variant="outline" className="gap-1.5">
                <Home className="h-3.5 w-3.5" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}

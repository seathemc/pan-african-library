"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function ViewSwitcher() {
  const params = useSearchParams()
  const view = params.get("view") ?? "dashboard"

  const tab = (label: string, value: string) => {
    const active = view === value
    return (
      <Link
        href={`/africa-2050?view=${value}`}
        className={`inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
          active
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1 gap-0.5">
      {tab("Dashboard", "dashboard")}
      {tab("Forecast", "forecast")}
    </div>
  )
}

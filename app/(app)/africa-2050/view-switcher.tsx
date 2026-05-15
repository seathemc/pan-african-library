"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

// "The Forecast" page splits into two views:
//   - reality: what's actually happening on the continent right now (live data)
//   - goals:   the Agenda 2063 commitments and projections (will we get there?)
// Internal URL param remains `view` for backwards compat with old links;
// `dashboard` aliases to `reality`, `forecast` aliases to `goals`.
export function ViewSwitcher() {
  const params = useSearchParams()
  const raw = params.get("view") ?? "reality"
  const view =
    raw === "dashboard" ? "reality" : raw === "forecast" ? "goals" : raw

  const tab = (label: string, value: string, sublabel: string) => {
    const active = view === value
    return (
      <Link
        href={`/africa-2050?view=${value}`}
        className={`group inline-flex flex-col items-start justify-center px-4 py-2 rounded-md transition-all min-w-[140px] ${
          active
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="text-sm font-semibold leading-tight">{label}</span>
        <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${active ? "text-muted-foreground" : "text-muted-foreground/70"}`}>
          {sublabel}
        </span>
      </Link>
    )
  }

  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1 gap-0.5">
      {tab("Our reality", "reality", "what's happening")}
      {tab("Our goals", "goals", "Agenda 2063 progress")}
    </div>
  )
}

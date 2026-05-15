// 404 page. Audit pass XIII (2026-05-15): added because there was no
// custom not-found.tsx — invalid URLs returned the default Next page.

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Compass, Home, Search } from "lucide-react"
import { WisdomLogo } from "@/components/wisdom-logo"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <WisdomLogo size={28} />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">404 · Not found</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          That page isn't here.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The page you tried to reach doesn't exist — or it moved during one of our recent
          refactors. The library, the Agenda 2063 dashboard, and the futures are all reachable from home.
        </p>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Link href="/">
            <Button variant="default" className="gap-1.5">
              <Home className="h-3.5 w-3.5" />
              Home
            </Button>
          </Link>
          <Link href="/browse">
            <Button variant="outline" className="gap-1.5">
              <Compass className="h-3.5 w-3.5" />
              Browse the archive
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserMenuProps {
  user: {
    email: string
    name?: string | null
  } | null
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.refresh()
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <User className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm truncate">{user.name || user.email}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="w-full justify-start gap-2 text-muted-foreground"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  )
}

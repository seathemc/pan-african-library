import { NextResponse } from "next/server"
import { signOut } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST() {
  try {
    await signOut()
    const cookieStore = await cookies()
    cookieStore.delete("session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error signing out:", error)
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 })
  }
}

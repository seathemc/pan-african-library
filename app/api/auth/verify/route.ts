import { NextRequest, NextResponse } from "next/server"
import { verifyMagicLink } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=missing-token", request.url))
    }

    const { sessionToken, expiresAt } = await verifyMagicLink(token)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Error verifying magic link:", error)
    const message = error instanceof Error ? error.message : "verification-failed"
    return NextResponse.redirect(new URL(`/login?error=${message}`, request.url))
  }
}

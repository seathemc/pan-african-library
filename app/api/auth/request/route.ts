import { NextRequest, NextResponse } from "next/server"
import { createMagicLink } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    const result = await createMagicLink(email)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating magic link:", error)
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    )
  }
}

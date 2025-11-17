import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { access_token } = await request.json()

    if (!access_token) {
      return NextResponse.json({ error: "No access token" }, { status: 400 })
    }

    // Verify the token with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser(access_token)

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Sync user to Prisma database
    const prismaUser = await prisma.user.upsert({
      where: { email: user.email! },
      update: {
        emailVerified: user.email_confirmed_at ? new Date(user.email_confirmed_at) : null,
        updatedAt: new Date(),
      },
      create: {
        id: user.id, // Use Supabase user ID
        email: user.email!,
        name: user.user_metadata?.name || null,
        emailVerified: user.email_confirmed_at ? new Date(user.email_confirmed_at) : null,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: prismaUser.id,
        email: prismaUser.email,
        name: prismaUser.name,
      }
    })
  } catch (error) {
    console.error("Error syncing user:", error)
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
  }
}

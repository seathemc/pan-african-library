import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { prisma } from "./prisma"
import crypto from "crypto"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export async function createMagicLink(email: string) {
  // Generate a random token
  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  // Store the magic link in database
  await prisma.magicLink.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  // In production, send email here
  const magicLinkUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3003"}/api/auth/verify?token=${token}`

  // For development, log the link
  console.log(`
    ========================================
    MAGIC LINK FOR ${email}
    ========================================
    ${magicLinkUrl}
    ========================================
  `)

  return { success: true, message: "Magic link sent!" }
}

export async function verifyMagicLink(token: string) {
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
  })

  if (!magicLink) {
    throw new Error("Invalid token")
  }

  if (magicLink.expiresAt < new Date()) {
    await prisma.magicLink.delete({ where: { id: magicLink.id } })
    throw new Error("Token expired")
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email: magicLink.email },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: magicLink.email,
        emailVerified: new Date(),
      },
    })
  } else if (!user.emailVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })
  }

  // Create session
  const sessionToken = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expiresAt,
    },
  })

  // Delete used magic link
  await prisma.magicLink.delete({ where: { id: magicLink.id } })

  return { user, sessionToken, expiresAt }
}

export async function createJWT(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET)
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string }
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return null
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return session.user
  } catch {
    return null
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session")?.value

  if (sessionToken) {
    await prisma.session.delete({
      where: { token: sessionToken },
    }).catch(() => {})
  }
}

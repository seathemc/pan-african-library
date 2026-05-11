import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  role: z.enum(["founder", "investor", "counsel", "policymaker", "academic", "other"]),
  country: z.string().min(2).max(80),
  organization: z.string().max(160).optional().or(z.literal("")),
  message: z.string().max(280).optional().or(z.literal("")),
  showPublicly: z.union([z.literal("on"), z.literal(""), z.boolean()]).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;
  const showPublicly =
    data.showPublicly === true || data.showPublicly === "on" ? true : data.showPublicly === false ? false : true;

  try {
    await prisma.signatory.upsert({
      where: { email: data.email.toLowerCase() },
      update: {
        name: data.name,
        role: data.role,
        country: data.country,
        organization: data.organization || null,
        message: data.message || null,
        showPublicly,
      },
      create: {
        name: data.name,
        email: data.email.toLowerCase(),
        role: data.role,
        country: data.country,
        organization: data.organization || null,
        message: data.message || null,
        showPublicly,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }
}

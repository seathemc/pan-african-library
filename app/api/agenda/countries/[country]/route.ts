import { NextResponse } from "next/server";
import { getAgendaCountryProfileData } from "@/lib/mcp-data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ country: string }> },
) {
  const { country } = await params;
  const profile = getAgendaCountryProfileData(country);

  if (!profile) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

import { NextResponse } from "next/server";
import { getFutureIndicatorData } from "@/lib/mcp-data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const indicator = getFutureIndicatorData(id);

  if (!indicator) {
    return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
  }

  return NextResponse.json(indicator);
}

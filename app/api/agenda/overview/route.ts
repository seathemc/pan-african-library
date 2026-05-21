import { NextResponse } from "next/server";
import { getAgendaOverviewData } from "@/lib/mcp-data";

export async function GET() {
  return NextResponse.json(getAgendaOverviewData());
}

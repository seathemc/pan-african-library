import { NextResponse } from "next/server";
import { getAgendaMethodologyData } from "@/lib/mcp-data";

export async function GET() {
  return NextResponse.json(getAgendaMethodologyData());
}

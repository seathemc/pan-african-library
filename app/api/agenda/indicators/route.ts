import { NextResponse } from "next/server";
import { listAgendaIndicatorsData } from "@/lib/mcp-data";

export async function GET() {
  return NextResponse.json(listAgendaIndicatorsData());
}

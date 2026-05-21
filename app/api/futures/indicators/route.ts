import { NextResponse } from "next/server";
import { listFutureIndicatorsData } from "@/lib/mcp-data";

export async function GET() {
  return NextResponse.json(listFutureIndicatorsData());
}

import { NextResponse } from "next/server";
import { getWisdomAboutData } from "@/lib/mcp-data";

export async function GET() {
  return NextResponse.json(getWisdomAboutData());
}

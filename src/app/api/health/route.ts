import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";

export async function GET() {
  try {
    // Try connecting to the database
    await connectToDB();

    return NextResponse.json(
      {
        status: "✅ OK",
        database: "✅ Connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "⚠️ ERROR",
        database: "❌ Connection Failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

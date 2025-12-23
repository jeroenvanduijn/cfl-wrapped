import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type View = {
  memberId: string;
  voornaam: string;
  code: string;
  timestamp: string;
  viewCount: number;
};

const VIEWS_KEY = "cfl-wrapped-views";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, voornaam, code } = body;

    if (!memberId || !voornaam || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get current views
    const views: View[] = (await kv.get(VIEWS_KEY)) || [];

    // Check if member already viewed (by code to handle both members and coaches)
    const existingIndex = views.findIndex((v) => v.code === code);

    if (existingIndex >= 0) {
      // Increment view count
      views[existingIndex].viewCount += 1;
      views[existingIndex].timestamp = new Date().toISOString();
    } else {
      // New view
      views.push({
        memberId: String(memberId),
        voornaam,
        code,
        timestamp: new Date().toISOString(),
        viewCount: 1,
      });
    }

    // Save back to KV
    await kv.set(VIEWS_KEY, views);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving view:", error);
    return NextResponse.json({ error: "Failed to save view" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const views: View[] = (await kv.get(VIEWS_KEY)) || [];
    return NextResponse.json(views);
  } catch (error) {
    console.error("Error getting views:", error);
    return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
  }
}

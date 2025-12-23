import { NextRequest, NextResponse } from "next/server";

type View = {
  memberId: string;
  voornaam: string;
  code: string;
  timestamp: string;
  viewCount: number;
};

// In-memory storage (will reset on cold starts, but works for Vercel)
// For production, consider using Vercel KV, Supabase, or similar
let viewsCache: View[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, voornaam, code } = body;

    if (!memberId || !voornaam || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if member already viewed (by code to handle both members and coaches)
    const existingIndex = viewsCache.findIndex((v) => v.code === code);

    if (existingIndex >= 0) {
      // Increment view count
      viewsCache[existingIndex].viewCount += 1;
      viewsCache[existingIndex].timestamp = new Date().toISOString();
    } else {
      // New view
      viewsCache.push({
        memberId: String(memberId),
        voornaam,
        code,
        timestamp: new Date().toISOString(),
        viewCount: 1,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving view:", error);
    return NextResponse.json({ error: "Failed to save view" }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json(viewsCache);
  } catch (error) {
    console.error("Error getting views:", error);
    return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
  }
}

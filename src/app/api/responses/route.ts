import { NextRequest, NextResponse } from "next/server";

type Response = {
  memberId: number;
  voornaam: string;
  voornemen2026: string;
  grootsteWin2025: string;
  timestamp: string;
};

// In-memory storage (will reset on cold starts, but works for Vercel)
// For production, consider using Vercel KV, Supabase, or similar
let responsesCache: Response[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, voornaam, voornemen2026, grootsteWin2025 } = body;

    if (!memberId || !voornaam) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if member already submitted
    const existingIndex = responsesCache.findIndex((r) => r.memberId === memberId);

    const newResponse: Response = {
      memberId,
      voornaam,
      voornemen2026: voornemen2026 || "",
      grootsteWin2025: grootsteWin2025 || "",
      timestamp: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      responsesCache[existingIndex] = newResponse;
    } else {
      responsesCache.push(newResponse);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json(responsesCache);
  } catch (error) {
    console.error("Error getting responses:", error);
    return NextResponse.json({ error: "Failed to get responses" }, { status: 500 });
  }
}

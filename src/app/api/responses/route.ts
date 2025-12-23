import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Response = {
  memberId: number;
  voornaam: string;
  voornemen2026: string;
  grootsteWin2025: string;
  timestamp: string;
};

const RESPONSES_KEY = "cfl-wrapped-responses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, voornaam, voornemen2026, grootsteWin2025 } = body;

    if (!memberId || !voornaam) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get current responses
    const responses: Response[] = (await kv.get(RESPONSES_KEY)) || [];

    // Check if member already submitted
    const existingIndex = responses.findIndex((r) => r.memberId === memberId);

    const newResponse: Response = {
      memberId,
      voornaam,
      voornemen2026: voornemen2026 || "",
      grootsteWin2025: grootsteWin2025 || "",
      timestamp: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      responses[existingIndex] = newResponse;
    } else {
      responses.push(newResponse);
    }

    // Save back to KV
    await kv.set(RESPONSES_KEY, responses);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const responses: Response[] = (await kv.get(RESPONSES_KEY)) || [];
    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error getting responses:", error);
    return NextResponse.json({ error: "Failed to get responses" }, { status: 500 });
  }
}

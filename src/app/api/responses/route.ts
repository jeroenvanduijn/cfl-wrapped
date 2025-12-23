import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

type Response = {
  memberId: number;
  voornaam: string;
  voornemen2026: string;
  grootsteWin2025: string;
  timestamp: string;
};

const RESPONSES_KEY = "cfl-wrapped-responses";

function getRedis() {
  return new Redis(process.env.REDIS_URL!);
}

export async function POST(request: NextRequest) {
  const redis = getRedis();
  try {
    const body = await request.json();
    const { memberId, voornaam, voornemen2026, grootsteWin2025 } = body;

    if (!memberId || !voornaam) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get current responses
    const data = await redis.get(RESPONSES_KEY);
    const responses: Response[] = data ? JSON.parse(data) : [];

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

    // Save back to Redis
    await redis.set(RESPONSES_KEY, JSON.stringify(responses));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  } finally {
    redis.disconnect();
  }
}

export async function GET() {
  const redis = getRedis();
  try {
    const data = await redis.get(RESPONSES_KEY);
    const responses: Response[] = data ? JSON.parse(data) : [];
    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error getting responses:", error);
    return NextResponse.json({ error: "Failed to get responses" }, { status: 500 });
  } finally {
    redis.disconnect();
  }
}

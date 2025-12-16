import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const RESPONSES_FILE = path.join(process.cwd(), "responses.json");

type Response = {
  memberId: number;
  voornaam: string;
  voornemen2026: string;
  grootsteWin2025: string;
  timestamp: string;
};

async function getResponses(): Promise<Response[]> {
  try {
    const data = await fs.readFile(RESPONSES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveResponses(responses: Response[]): Promise<void> {
  await fs.writeFile(RESPONSES_FILE, JSON.stringify(responses, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, voornaam, voornemen2026, grootsteWin2025 } = body;

    if (!memberId || !voornaam) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const responses = await getResponses();

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

    await saveResponses(responses);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const responses = await getResponses();
    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error getting responses:", error);
    return NextResponse.json({ error: "Failed to get responses" }, { status: 500 });
  }
}

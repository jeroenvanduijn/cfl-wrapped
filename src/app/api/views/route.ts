import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const VIEWS_FILE = path.join(process.cwd(), "views.json");

type View = {
  memberId: number;
  voornaam: string;
  code: string;
  timestamp: string;
  viewCount: number;
};

async function getViews(): Promise<View[]> {
  try {
    const data = await fs.readFile(VIEWS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveViews(views: View[]): Promise<void> {
  await fs.writeFile(VIEWS_FILE, JSON.stringify(views, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, voornaam, code } = body;

    if (!memberId || !voornaam || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const views = await getViews();

    // Check if member already viewed
    const existingIndex = views.findIndex((v) => v.memberId === memberId);

    if (existingIndex >= 0) {
      // Increment view count
      views[existingIndex].viewCount += 1;
      views[existingIndex].timestamp = new Date().toISOString();
    } else {
      // New view
      views.push({
        memberId,
        voornaam,
        code,
        timestamp: new Date().toISOString(),
        viewCount: 1,
      });
    }

    await saveViews(views);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving view:", error);
    return NextResponse.json({ error: "Failed to save view" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const views = await getViews();
    return NextResponse.json(views);
  } catch (error) {
    console.error("Error getting views:", error);
    return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
  }
}

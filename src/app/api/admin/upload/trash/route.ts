import { moveToTrash } from "@/lib/bunny";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "imageUrl is required and must be a string" },
        { status: 400 }
      );
    }

    // Extract the file path from the CDN URL
    const pullZoneUrl = process.env.BUNNY_PULL_ZONE_URL?.replace(/\/$/, "") || "";
    const filePath = imageUrl.replace(pullZoneUrl + "/", "");

    if (!filePath || filePath === imageUrl) {
      return NextResponse.json(
        { error: "Invalid imageUrl format. Could not extract file path." },
        { status: 400 }
      );
    }

    // Move to trash
    const newUrl = await moveToTrash(filePath);

    return NextResponse.json({ url: newUrl }, { status: 200 });
  } catch (error) {
    console.error("Trash error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

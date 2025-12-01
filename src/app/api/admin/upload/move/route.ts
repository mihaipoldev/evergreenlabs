import { moveImageBetweenFolders } from "@/lib/bunny";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageUrl, newFolderPath } = await request.json();

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "imageUrl is required and must be a string" },
        { status: 400 }
      );
    }

    if (!newFolderPath || typeof newFolderPath !== "string") {
      return NextResponse.json(
        { error: "newFolderPath is required and must be a string" },
        { status: 400 }
      );
    }

    // Move the image
    const newUrl = await moveImageBetweenFolders(imageUrl, newFolderPath);

    return NextResponse.json({ url: newUrl }, { status: 200 });
  } catch (error) {
    console.error("Move error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

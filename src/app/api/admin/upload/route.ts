import { uploadToBunny } from "@/lib/bunny";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const folderPath = formData.get("folderPath") as string;
    const file = formData.get("file") as File | null;
    const imageUrl = formData.get("imageUrl") as string | null;

    if (!folderPath) {
      return NextResponse.json(
        { error: "folderPath is required" },
        { status: 400 }
      );
    }

    let fileBuffer: Buffer;
    let originalFilename: string;
    let extension: string;

    if (file) {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      originalFilename = file.name;
      extension = originalFilename.split(".").pop() || "jpg";
    } else if (imageUrl) {
      // Download image from URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to download image from URL: ${response.statusText}` },
          { status: 400 }
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !ALLOWED_IMAGE_TYPES.includes(contentType)) {
        return NextResponse.json(
          {
            error: `Invalid image type from URL. Allowed types: ${ALLOWED_IMAGE_TYPES.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);

      // Validate size
      if (fileBuffer.length > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        );
      }

      // Extract extension from URL or content type
      const urlPath = new URL(imageUrl).pathname;
      const urlExtension = urlPath.split(".").pop();
      if (urlExtension && urlExtension.length <= 5) {
        extension = urlExtension;
      } else {
        // Fallback to extension from content type
        extension = contentType.split("/")[1] || "jpg";
      }
      originalFilename = `image_${Date.now()}.${extension}`;
    } else {
      return NextResponse.json(
        { error: "Either 'file' or 'imageUrl' must be provided" },
        { status: 400 }
      );
    }

    // Generate filename
    const timestamp = Date.now();
    const filename = `image_${timestamp}.${extension}`;
    const uploadPath = `${folderPath}/${filename}`.replace(/\/+/g, "/"); // Remove duplicate slashes

    // Upload to Bunny
    const cdnUrl = await uploadToBunny(fileBuffer, uploadPath);

    return NextResponse.json({ url: cdnUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

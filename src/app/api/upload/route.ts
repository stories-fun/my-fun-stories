import { NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const walletAddress = formData.get("walletAddress") as string;

    if (!file || !walletAddress) {
      return NextResponse.json(
        { error: "Missing file or wallet address" },
        { status: 400 }
      );
    }

    // Get the presigned URL from your TRPC endpoint
    const uploadData = await api.user.getUploadUrl({
      walletAddress,
      fileType: file.type,
    });

    const { uploadUrl, key } = uploadData as { uploadUrl: { url: string } | string; key: string };
    const urlToFetch = typeof uploadUrl === "object" && "url" in uploadUrl ? uploadUrl.url : uploadUrl;

    // Upload to R2 from the server
    const upload = await fetch(urlToFetch, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!upload.ok) {
      throw new Error("Failed to upload file");
    }

    return NextResponse.json({ key });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to upload file" 
      },
      { status: 500 }
    );
  }
} 
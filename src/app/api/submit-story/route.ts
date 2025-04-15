import { NextResponse } from "next/server";
import { api } from "~/trpc/server";
import { getConversation } from "~/server/api/r2/voice";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, content, title = "My Voice Story" } = data;

    if (!userId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get user info to use their username
    const userResult = await api.user.get({
      walletAddress: userId,
    });

    const writerName = userResult?.username || "Anonymous";

    // Submit the story
    const result = await api.story.submit({
      walletAddress: userId,
      writerName,
      content,
      title,
    });

    if (!result.success) {
      throw new Error("Failed to submit story");
    }

    return NextResponse.json({
      success: true,
      storyKey: result.key,
    });
  } catch (error) {
    console.error("Error submitting story:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to submit story",
      },
      { status: 500 },
    );
  }
}

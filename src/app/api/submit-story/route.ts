import { NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function POST(req: Request) {
  try {
    // Define expected type for request body
    interface SubmitStoryBody {
      userId?: string;
      content?: string;
      title?: string;
    }
    const data = (await req.json()) as SubmitStoryBody;
    const { userId, content, title = "My Voice Story" } = data;

    if (!userId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get user info to use their username
    const userResult: { username: string | null } | null = await api.user.get({
      walletAddress: userId,
    });

    const writerName = userResult?.username ?? "Anonymous";

    // Submit the story
    const result: { success: boolean; key: string | null } =
      await api.story.submit({
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

"use server";
import { api } from "../trpc/server";
type StoryResult = {
  stories: any[];
  nextCursor?: string;
  error?: string;
  debugWalletAddress?: string;
};

export const getStoriesFromServer = async (): Promise<StoryResult> => {
  try {
    const result = await api.story.list({
      limit: 100,
    });
    return {
      stories: result.stories ?? [],
      nextCursor: result.nextCursor ?? undefined,
    };
  } catch (error) {
    return {
      stories: [],
      error: error instanceof Error ? error.message : "Failed to get stories",
    };
  }
};

export const getMoreStoriesFromServer = async (cursor: string) => {
  try {
    const result = await api.story.list({
      cursor,
      limit: 100,
    });
    return {
      stories: result.stories ?? [],
      nextCursor: result.nextCursor ?? undefined,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to get more stories",
    };
  }
};

export const getByIdFromServer = async (storyKey: string) => {
  try {
    const result = await api.story.getById({ storyKey });
    console.log("here is result from getById", result);
    return {
      story: result.story ?? [],
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to get more stories",
    };
  }
};

export const createLike = async (storyKey: string, walletAddress: string) => {
  try {
    const result = await api.story.like({
      storyKey,
      walletAddress,
    });
    console.log("Here is result from action.ts likes", result.likes);
    return {
      likeCount: result.likes,
      success: result.success,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to get more stories",
    };
  }
};

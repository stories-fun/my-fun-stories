import { create } from "zustand";
import {
  createLike,
  getByIdFromServer,
  getMoreStoriesFromServer,
  getStoriesFromServer,
  voteComment,
} from "~/server/action";

interface Story {
  id: string;
  walletAddres: string;
  username: string;
  content: string;
  title: string;
  createdAt: Date;
  likeCount: number;
  likes: string[];
  comments: Comment[];
}
interface StoriesSlice {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  nextCursor: string | undefined;
  likeCounts: Record<string, number>;
}
interface Comment {
  id: string;
  content: string;
  walletAddress: string;
  username: string;
  createdAt: Date;
  upvotes: string[];
  downvotes: string[];
  replies: Comment[];
}

interface StoriesActions {
  getStories: (walletAddress?: string) => Promise<void>;
  getMoreStories: () => Promise<void>;
  getById: (storyKey: string) => Promise<void>;
  like: (storyKey: string, walletAddress: string) => Promise<void>;
  voteComment: (
    storyKey: string,
    commentId: string,
    walletAddress: string,
    voteType: "upvote" | "downvote" | "remove",
  ) => Promise<void>;
}

type StoriesState = StoriesSlice & StoriesActions;
// toDate
const toDate = (date: string | Date) => {
  if (!date) return new Date();
  return typeof date === "string" ? new Date(date) : date;
};

// Helper function
const transformStory = (story: {
  id?: string;
  key?: string;
  walletAddress?: string;
  username?: string;
  content?: string;
  title?: string;
  createdAt: string | Date;
  likes?: string[];
  comments?: Comment[];
}): Story => ({
  id: story.id ?? story.key ?? "",
  walletAddres: story.walletAddress ?? "",
  username: story.username ?? "",
  content: story.content ?? "",
  title: story.title ?? "",
  createdAt: toDate(story.createdAt),
  likeCount: Array.isArray(story.likes) ? story.likes.length : 0,
  likes: story.likes ?? [],
  comments: story.comments ?? [], // Initialize empty comments array since comments don't exist in input type
});

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  isLoading: false,
  error: null,
  nextCursor: undefined,
  likeCounts: {},

  getStories: async () => {
    set({ isLoading: true, error: null });
    const result = await getStoriesFromServer();
    const transformStories = (result?.stories ?? []).map(transformStory);
    set({
      stories: transformStories,
      nextCursor: result?.nextCursor,
      isLoading: false,
      error: result?.error,
    });
  },

  getMoreStories: async () => {
    const { nextCursor, stories } = get();
    if (!nextCursor || get().isLoading) return;
    set({ isLoading: true });
    const result = await getMoreStoriesFromServer(nextCursor);
    const transformStories = (result?.stories ?? [])
      .filter((story): story is NonNullable<typeof story> => story !== null)
      .map(transformStory);
    set({
      stories: [...stories, ...transformStories],
      nextCursor: result?.nextCursor,
      isLoading: false,
      error: result?.error,
    });
  },

  getById: async (storyKey: string) => {
    set({ isLoading: true });
    const result = await getByIdFromServer(storyKey);
    if (result?.story) {
      // Instead of replacing stories, append or update the specific story
      const currentStories = get().stories;
      const storyExists = currentStories.some((s) => s.id === result.story.id);

      const updatedStories = storyExists
        ? currentStories.map((s) =>
            s.id === result.story.id ? transformStory(result.story) : s,
          )
        : [...currentStories, transformStory(result.story)];

      set({
        stories: updatedStories,
        isLoading: false,
        error: result?.error,
      });
    }
  },

  like: async (storyKey: string, walletAddress: string) => {
    const result = await createLike(storyKey, walletAddress);
    if (result?.likeCount !== undefined) {
      set((state) => ({
        stories: state.stories.map((story) =>
          story.id === storyKey
            ? {
                ...story,
                likeCount: result.likeCount,
                likes: [...story.likes, walletAddress],
              }
            : story,
        ),
        error: null,
      }));
    } else if (result?.error) {
      set({ error: result.error });
    }
  },

  voteComment: async (
    storyKey: string,
    walletAddress: string,
    commentId: string,
    voteType: "upvote" | "downvote" | "remove",
  ) => {
    const result = await voteComment(
      storyKey,
      walletAddress,
      commentId,
      voteType,
    );
    if (result.success) {
      set((state) => ({
        stories: state.stories.map((story) =>
          story.id === storyKey
            ? {
                ...story,
                comments: story.comments.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        upvotes:
                          voteType === "upvote"
                            ? [...comment.upvotes, walletAddress]
                            : comment.upvotes.filter(
                                (addr) => addr !== walletAddress,
                              ),
                        downvotes:
                          voteType === "downvote"
                            ? [...comment.downvotes, walletAddress]
                            : comment.downvotes.filter(
                                (addr) => addr !== walletAddress,
                              ),
                      }
                    : comment,
                ),
              }
            : story,
        ),
        error: null,
      }));
    } else if (result.error) {
      set({ error: result.error });
    }
  },
}));

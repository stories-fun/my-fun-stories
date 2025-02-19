import { create } from "zustand";
import {
  createLike,
  getByIdFromServer,
  getMoreStoriesFromServer,
  getStoriesFromServer,
} from "~/server/action";

interface Story {
  id: string;
  walletAddres: string;
  username: string;
  content: string;
  title: string;
  createdAt: Date;
  likeCount: number;
  comments: Comment[];
}
interface StoriesSlice {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  nextCursor: string | undefined;
  likeCounts: { [key: string]: number };
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
}

type StoriesState = StoriesSlice & StoriesActions;
// toDate
const toDate = (date: string | Date) => {
  if (!date) return new Date();
  return typeof date === "string" ? new Date(date) : date;
};

// Helper function
const transformStory = (story: any): Story => ({
  id: story.id ?? story.key ?? "",
  walletAddres: story.walletAddress ?? "",
  username: story.username ?? "",
  content: story.content ?? "",
  title: story.title,
  createdAt: toDate(story.createdAt),
  likeCount: Array.isArray(story.likes) ? story.likes.length : 0,
  comments: Array.isArray(story.comments) ? story.comments : [],
});

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  isLoading: false,
  error: null,
  nextCursor: undefined,
  likeCounts: {},

  getStories: async (walletAddress) => {
    set({ isLoading: true, error: null });
    const result = await getStoriesFromServer(walletAddress);
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
    const transformStories = (result?.stories ?? []).map(transformStory);
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
      set({
        stories: [transformStory(result.story)],
        isLoading: false,
        error: result?.error,
      });
    }
  },

  like: async (storyKey: string, walletAddress: string) => {
    const result = await createLike(storyKey, walletAddress);
    // if (result && result.likeCount !== undefined) {
    //   set((state) => ({
    //     likeCounts: { ...state.likeCounts, [storyKey]: result.likeCount },
    //     isLoading: false,
    //     error: result?.error,
    //   }));
    // }
    if (result && result.likeCount !== undefined) {
      set((state) => ({
        stories: state.stories.map((story) =>
          story.id === storyKey
            ? { ...story, likeCount: result.likeCount }
            : story,
        ),
        error: null, // Clear errors if the request is successful
      }));
    }
  },
}));

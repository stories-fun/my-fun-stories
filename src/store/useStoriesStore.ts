import { create } from "zustand";
import {
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
  likes: string[];
  comments: Comment[];
}
interface StoriesSlice {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  nextCursor: string | undefined;
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
  likes: Array.isArray(story.likes) ? story.likes : [],
  comments: Array.isArray(story.comments) ? story.comments : [],
});

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  isLoading: false,
  error: null,
  nextCursor: undefined,

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
}));

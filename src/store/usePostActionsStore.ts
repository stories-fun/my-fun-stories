import { create } from "zustand";

interface PostActionSpecificState {
  isLiked: boolean;
  count: number;
}

interface PostActionsState {
  userWallet: string | null;
  setUserWallet: (value: string | null) => void;

  postStates: Record<string, PostActionSpecificState>;
  setIsLiked: (storyKey: string, value: boolean) => void;
  setCount: (
    storyKey: string,
    value: number | ((prev: number) => number),
  ) => void;

  getIsLiked: (storyKey: string) => boolean;
  getCount: (storyKey: string) => number;
}

const getDefaultPostState = (): PostActionSpecificState => ({
  isLiked: false,
  count: 0,
});

export const usePostActionsStore = create<PostActionsState>((set, get) => ({
  userWallet: null,
  setUserWallet: (value) => set({ userWallet: value }),

  postStates: {},
  setIsLiked: (storyKey, value) =>
    set((state) => ({
      postStates: {
        ...state.postStates,
        [storyKey]: {
          ...(state.postStates[storyKey] ?? getDefaultPostState()),
          isLiked: value,
        },
      },
    })),
  setCount: (storyKey, value) =>
    set((state) => ({
      postStates: {
        ...state.postStates,
        [storyKey]: {
          ...(state.postStates[storyKey] ?? getDefaultPostState()),
          count:
            typeof value === "function"
              ? value(state.postStates[storyKey]?.count ?? 0)
              : value,
        },
      },
    })),

  getIsLiked: (storyKey) => {
    const state = get().postStates[storyKey];
    return state?.isLiked ?? false;
  },
  getCount: (storyKey) => {
    const state = get().postStates[storyKey];
    return state?.count ?? 0;
  },
}));

import { create } from "zustand";

interface CommentSpecificState {
  isCollapsed: boolean;
  showReplyInput: boolean;
  replyContent: string;
  showShareModal: boolean;
}

interface CommentsState {
  commentStates: Record<string, CommentSpecificState>;
  setCommentCollapsed: (commentId: string, value: boolean) => void;
  setCommentReplyInput: (commentId: string, value: boolean) => void;
  setCommentReplyContent: (commentId: string, value: string) => void;
  setCommentShareModal: (commentId: string, value: boolean) => void;

  newComment: string;
  setNewComment: (value: string) => void;
  visibleComments: number;
  setVisibleComments: (value: number) => void;
  COMMENTS_PER_PAGE: number;

  copied: boolean;
  setCopied: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  commentUrl: string;
  setCommentUrl: (value: string) => void;
  twitterShareUrl: string;
  setTwitterShareUrl: (value: string) => void;
  facebookShareUrl: string;
  setFacebookShareUrl: (value: string) => void;
  embedCode: string;
  setEmbedCode: (value: string) => void;
}

const getDefaultCommentState = (): CommentSpecificState => ({
  isCollapsed: true,
  showReplyInput: false,
  replyContent: "",
  showShareModal: false,
});

export const useCommentsStore = create<CommentsState>((set) => ({
  commentStates: {},
  setCommentCollapsed: (commentId, value) =>
    set((state) => ({
      commentStates: {
        ...state.commentStates,
        [commentId]: {
          ...(state.commentStates[commentId] ?? getDefaultCommentState()),
          isCollapsed: value,
        },
      },
    })),
  setCommentReplyInput: (commentId, value) =>
    set((state) => ({
      commentStates: {
        ...state.commentStates,
        [commentId]: {
          ...(state.commentStates[commentId] ?? getDefaultCommentState()),
          showReplyInput: value,
        },
      },
    })),
  setCommentReplyContent: (commentId, value) =>
    set((state) => ({
      commentStates: {
        ...state.commentStates,
        [commentId]: {
          ...(state.commentStates[commentId] ?? getDefaultCommentState()),
          replyContent: value,
        },
      },
    })),
  setCommentShareModal: (commentId, value) =>
    set((state) => ({
      commentStates: {
        ...state.commentStates,
        [commentId]: {
          ...(state.commentStates[commentId] ?? getDefaultCommentState()),
          showShareModal: value,
        },
      },
    })),

  newComment: "",
  setNewComment: (value) => set({ newComment: value }),
  visibleComments: 5,
  setVisibleComments: (value) => set({ visibleComments: value }),
  COMMENTS_PER_PAGE: 5,

  copied: false,
  setCopied: (value) => set({ copied: value }),
  activeTab: "link",
  setActiveTab: (value) => set({ activeTab: value }),
  commentUrl: "",
  setCommentUrl: (value) => set({ commentUrl: value }),
  twitterShareUrl: "",
  setTwitterShareUrl: (value) => set({ twitterShareUrl: value }),
  facebookShareUrl: "",
  setFacebookShareUrl: (value) => set({ facebookShareUrl: value }),
  embedCode: "",
  setEmbedCode: (value) => set({ embedCode: value }),
}));

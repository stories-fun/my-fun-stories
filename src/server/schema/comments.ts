import { z } from "zod";

// Define the input type that matches the raw data shape
export interface CommentInput {
  id: string;
  content: string;
  walletAddress: string;
  username: string;
  createdAt: string | Date;
  upvotes?: string[];
  downvotes?: string[];
  replies?: CommentInput[];
}

// Define the output type with proper Date
export interface Comment {
  id: string;
  content: string;
  walletAddress: string;
  username: string;
  createdAt: Date;
  upvotes: string[];
  downvotes: string[];
  replies: Comment[];
}

const baseSchema = z.object({
  id: z.string(),
  content: z.string(),
  walletAddress: z.string(),
  username: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  upvotes: z
    .array(z.string())
    .optional()
    .transform((arr) => arr ?? []),
  downvotes: z
    .array(z.string())
    .optional()
    .transform((arr) => arr ?? []),
});

// Create the recursive schema with proper input/output types
export const commentSchema: z.ZodType<Comment, z.ZodTypeDef, CommentInput> =
  z.lazy(() =>
    baseSchema
      .extend({
        replies: z
          .array(commentSchema)
          .optional()
          .transform((arr) => arr ?? []),
      })
      .transform((data) => ({
        ...data,
        createdAt:
          data.createdAt instanceof Date
            ? data.createdAt
            : new Date(data.createdAt),
        replies: (data.replies ?? []).map((reply) => ({
          ...reply,
          createdAt:
            reply.createdAt instanceof Date
              ? reply.createdAt
              : new Date(reply.createdAt),
        })),
      })),
  );

export interface CommentWithScore extends Comment {
  score: number;
}

export interface CommentWithScoreInput extends CommentInput {
  score: number;
}

export const CommentWithScoreSchema: z.ZodType<
  CommentWithScore,
  z.ZodTypeDef,
  CommentWithScoreInput
> = z.lazy(() =>
  baseSchema
    .extend({
      replies: z
        .array(CommentWithScoreSchema)
        .optional()
        .transform((arr) => arr ?? []),
      score: z.number(),
    })
    .transform((data) => ({
      ...data,
      createdAt:
        data.createdAt instanceof Date
          ? data.createdAt
          : new Date(data.createdAt),
      replies: (data.replies ?? []).map((reply) => ({
        ...reply,
        createdAt:
          reply.createdAt instanceof Date
            ? reply.createdAt
            : new Date(reply.createdAt),
      })),
    })),
);

export function calculateCommentScore(comment: Comment): number {
  return comment.upvotes.length - comment.downvotes.length;
}

export function sortComments(comments: Comment[]): CommentWithScore[] {
  return comments
    .map((c) => ({
      ...c,
      score: calculateCommentScore(c),
      replies: sortComments(c.replies),
    }))
    .sort((a, b) => b.score - a.score);
}

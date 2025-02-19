import { z } from "zod";

interface IComment {
  id: string;
  content: string;
  walletAddress: string;
  username: string;
  createdAt: Date;
  upvotes: string[];
  downvotes: string[];
  replies: IComment[];
}

const CommentBase = z.object({
  id: z.string(),
  content: z.string().min(1),
  walletAddress: z.string(),
  username: z.string(),
  // createdAt: z.date(),
  createdAt: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  upvotes: z.array(z.string()).default([]),
  downvotes: z.array(z.string()).default([]),
});

// @ts-ignore-next-line
const CommentSchema: z.ZodType<IComment> = CommentBase.extend({
  replies: z.array(z.lazy(() => CommentSchema)).default([]),
});

export const commentSchema = CommentSchema;

export type Comment = z.infer<typeof commentSchema>;

// @ts-ignore-next-line
export const CommentWithScore = commentSchema.extend({
  score: z.number(),
});

export type CommentWithScore = z.infer<typeof CommentWithScore>;

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

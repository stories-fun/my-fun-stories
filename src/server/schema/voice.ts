import { z } from "zod";

export const VoiceMessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  timestamp: z.number(),
  transcription: z.string(),
  aiResponse: z.string(),
  audioUrl: z.string().optional(),
});

export type VoiceMessage = z.infer<typeof VoiceMessageSchema>;

export const VoiceConversationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  messages: z.array(VoiceMessageSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type VoiceConversation = z.infer<typeof VoiceConversationSchema>;

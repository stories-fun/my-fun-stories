import { v4 as uuidv4 } from "uuid";
import {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { env } from "../../../env";
import {
  type VoiceConversation,
  type VoiceMessage,
} from "~/server/schema/voice";
import { getR2Instance } from "./message";

const VOICE_PREFIX = "voice-conversations";

const getUserConversationPath = (userId: string) => `${VOICE_PREFIX}/${userId}`;

const getConversationPath = (userId: string, conversationId: string) =>
  `${getUserConversationPath(userId)}/${conversationId}.json`;

export const createConversation = async (
  userId: string,
): Promise<VoiceConversation> => {
  const r2 = getR2Instance();
  const conversationId = uuidv4();
  const timestamp = Date.now();

  const conversation: VoiceConversation = {
    id: conversationId,
    userId,
    messages: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await r2.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: getConversationPath(userId, conversationId),
      Body: JSON.stringify(conversation),
      ContentType: "application/json",
    }),
  );

  return conversation;
};

export const addMessageToConversation = async (
  userId: string,
  conversationId: string,
  transcription: string,
  aiResponse: string,
  audioUrl?: string,
): Promise<VoiceMessage> => {
  const r2 = getR2Instance();
  const messageId = uuidv4();
  const timestamp = Date.now();

  const conversation = await getConversation(userId, conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const message: VoiceMessage = {
    id: messageId,
    userId,
    timestamp,
    transcription,
    aiResponse,
    audioUrl,
  };

  conversation.messages.push(message);
  conversation.updatedAt = timestamp;

  await r2.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: getConversationPath(userId, conversationId),
      Body: JSON.stringify(conversation),
      ContentType: "application/json",
    }),
  );

  return message;
};

export const getConversation = async (
  userId: string,
  conversationId: string,
): Promise<VoiceConversation | null> => {
  const r2 = getR2Instance();
  try {
    const response = await r2.send(
      new GetObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: getConversationPath(userId, conversationId),
      }),
    );

    const rawData = await response.Body!.transformToString();
    return JSON.parse(rawData) as VoiceConversation;
  } catch (error) {
    console.error(`Error getting conversation ${conversationId}:`, error);
    return null;
  }
};

export const listUserConversations = async (
  userId: string,
): Promise<VoiceConversation[]> => {
  const r2 = getR2Instance();
  try {
    const response = await r2.send(
      new ListObjectsV2Command({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Prefix: getUserConversationPath(userId),
      }),
    );

    const conversations: VoiceConversation[] = [];
    for (const object of response.Contents ?? []) {
      if (!object.Key) continue;

      const conversationResponse = await r2.send(
        new GetObjectCommand({
          Bucket: env.CLOUDFLARE_BUCKET_NAME,
          Key: object.Key,
        }),
      );

      const rawData = await conversationResponse.Body!.transformToString();
      conversations.push(JSON.parse(rawData) as VoiceConversation);
    }

    return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error(`Error listing conversations for user ${userId}:`, error);
    return [];
  }
};

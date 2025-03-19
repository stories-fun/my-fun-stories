import { v4 as uuidv4 } from "uuid";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { env } from "../../../env";
import type { HttpRequest } from "@aws-sdk/protocol-http";
import { type CreateMessageInput, type Message } from "~/server/schema/message";

// Create S3 client for R2
export const getR2Instance = () => {
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  client.middlewareStack.add(
    (next) => async (args) => {
      const request = args.request as HttpRequest;
      delete request.headers["x-amz-checksum-mode"];
      request.headers["x-amz-checksum-algorithm"] = "CRC32";
      return next(args);
    },
    { step: "build", name: "r2ChecksumFix", priority: "high" },
  );

  return client;
};

const MESSAGES_PREFIX = "messages";

// Helper to get user-specific message path
const getUserMessagePath = (userId: string) => `${MESSAGES_PREFIX}/${userId}`;

// Helper to get conversation path between two users
const getConversationPath = (userId1: string, userId2: string) => {
  // Sort IDs to ensure consistent path regardless of who's sending/receiving
  const sortedIds = [userId1, userId2].sort();
  return `${MESSAGES_PREFIX}/conversations/${sortedIds[0]}_${sortedIds[1]}`;
};

// Helper to get specific message path
const getMessagePath = (conversationId: string, messageId: string) =>
  `${conversationId}/${messageId}.json`;

// Function to put object in R2
const putObject = async (r2: S3Client, key: string, data: unknown) => {
  await r2.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    }),
  );
};

// Function to get object from R2
const getObject = async <T>(r2: S3Client, key: string): Promise<T | null> => {
  try {
    const response = await r2.send(
      new GetObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: key,
      }),
    );

    const rawData = await response.Body!.transformToString();
    return JSON.parse(rawData) as T;
  } catch (error) {
    console.error(`Error getting object with key ${key}:`, error);
    return null;
  }
};

// Function to list objects in R2
const listObjects = async (r2: S3Client, prefix: string) => {
  try {
    const response = await r2.send(
      new ListObjectsV2Command({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Prefix: prefix,
      }),
    );

    return response.Contents ?? [];
  } catch (error) {
    console.error(`Error listing objects with prefix ${prefix}:`, error);
    return [];
  }
};

export const storeMessage = async (
  r2: S3Client,
  input: CreateMessageInput,
): Promise<Message> => {
  const messageId = uuidv4();
  const now = new Date();

  const message: Message = {
    ...input,
    id: messageId,
    createdAt: now,
    read: false,
  };

  const conversationPath = getConversationPath(
    input.senderId,
    input.receiverId,
  );
  const messagePath = getMessagePath(conversationPath, messageId);

  await putObject(r2, messagePath, message);

  // Store reference to conversation in user's messages index
  await updateUserConversationIndex(r2, input.senderId, input.receiverId);
  await updateUserConversationIndex(r2, input.receiverId, input.senderId);

  return message;
};

// Update user's conversation index
async function updateUserConversationIndex(
  r2: S3Client,
  userId: string,
  conversationPartnerId: string,
) {
  const userPath = getUserMessagePath(userId);
  const indexPath = `${userPath}/index.json`;

  let conversationIndex: string[] = [];

  const existingIndex = await getObject<string[]>(r2, indexPath);
  if (existingIndex) {
    conversationIndex = existingIndex;
  }

  // Add the conversation partner if not already in the index
  if (!conversationIndex.includes(conversationPartnerId)) {
    conversationIndex.push(conversationPartnerId);
    await putObject(r2, indexPath, conversationIndex);
  }
}

export const getConversation = async (
  r2: S3Client,
  userId1: string,
  userId2: string,
  limit = 50,
): Promise<Message[]> => {
  const conversationPath = getConversationPath(userId1, userId2);

  try {
    const objects = await listObjects(r2, conversationPath + "/");

    const messagePromises = objects
      .slice(-limit) // Get the most recent messages
      .map(async (obj) => {
        const message = await getObject<Message>(r2, obj.Key!);
        return message;
      });

    const messages = (await Promise.all(messagePromises)).filter(
      (m): m is Message => m !== null,
    );

    // Sort by createdAt
    return messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return [];
  }
};

export const getUserConversations = async (
  r2: S3Client,
  userId: string,
): Promise<string[]> => {
  const userPath = getUserMessagePath(userId);
  const indexPath = `${userPath}/index.json`;

  const index = await getObject<string[]>(r2, indexPath);
  return index ?? [];
};

export const markMessagesAsRead = async (
  r2: S3Client,
  senderId: string,
  receiverId: string,
): Promise<void> => {
  const conversationPath = getConversationPath(senderId, receiverId);

  try {
    const objects = await listObjects(r2, conversationPath + "/");

    for (const obj of objects) {
      const message = await getObject<Message>(r2, obj.Key!);

      if (message && message.receiverId === receiverId && !message.read) {
        message.read = true;
        await putObject(r2, obj.Key!, message);
      }
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

export const getUnreadMessageCounts = async (
  r2: S3Client,
  userId: string,
): Promise<number> => {
  const conversations = await getUserConversations(r2, userId);
  let totalUnread = 0;

  for (const partnerId of conversations) {
    const conversationPath = getConversationPath(userId, partnerId);

    try {
      const objects = await listObjects(r2, conversationPath + "/");

      for (const obj of objects) {
        const message = await getObject<Message>(r2, obj.Key!);

        if (message && message.receiverId === userId && !message.read) {
          totalUnread++;
        }
      }
    } catch (error) {
      console.error(
        `Error counting unread messages for conversation with ${partnerId}:`,
        error,
      );
    }
  }

  return totalUnread;
};

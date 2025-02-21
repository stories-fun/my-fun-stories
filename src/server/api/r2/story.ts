import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { StorySchema } from "~/server/schema/story";
import { env } from "../../../env";
import type { HttpRequest } from "@aws-sdk/protocol-http";
import type { Comment } from "~/server/schema/comments";

export class StoryStorage {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = this.createS3Client();
    this.bucket = env.CLOUDFLARE_BUCKET_NAME;
  }

  private createS3Client() {
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
  }

  async saveStory(key: string, data: unknown) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: `stories/${key}.json`,
        Body: JSON.stringify(data),
        ContentType: "application/json",
      }),
    );
  }

  async getStory(key: string) {
    console.log("key", key);
    try {
      console.log("Getting story with key:", `stories/${key}.json`);
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: `stories/${key}.json`,
        }),
      );
      const rawData = await response.Body!.transformToString();
      const data = JSON.parse(rawData) as unknown;

      // If the id is missing, derive it from the key string
      if (
        typeof data === "object" &&
        data !== null &&
        !("id" in data) &&
        typeof key === "string"
      ) {
        const derivedId = key.split("/").pop()?.replace(".json", "");
        (data as Record<string, unknown>).id = derivedId;
      }

      // Convert createdAt from string to Date if necessary
      if (
        data &&
        typeof data === "object" &&
        "createdAt" in data &&
        typeof data.createdAt === "string"
      ) {
        data.createdAt = new Date(data.createdAt);
      }

      return StorySchema.parse(data);
    } catch (error) {
      console.error("Error getting story:", error);
      return null;
    }
  }

  async updateStoryComments(
    key: string,
    updateFn: (comments: Comment[]) => Comment[],
  ) {
    const story = await this.getStory(key);
    if (!story) return null;

    const updatedComments = updateFn(story.comments);
    story.comments = updatedComments;
    await this.saveStory(key, story);
    return story;
  }

  findCommentById(comments: Comment[], targetId: string): Comment | null {
    for (const comment of comments) {
      if (comment.id === targetId) return comment;
      if (comment.replies.length > 0) {
        const found = this.findCommentById(comment.replies, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  async listObjects(prefix: string, continuationToken?: string) {
    console.log("Listing objects with prefix:", prefix);
    const response = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );
    console.log("List objects response:", {
      bucket: this.bucket,
      contents: response.Contents?.map((obj) => obj.Key),
      count: response.Contents?.length ?? 0,
    });

    return {
      objects: response.Contents ?? [],
      nextToken: response.NextContinuationToken,
    };
  }
}

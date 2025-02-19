import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { env } from "../../../env";
import type { HttpRequest } from "@aws-sdk/protocol-http";

export class UserStorage {
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

  getClient() {
    return this.client;
  }

  getBucketName() {
    return this.bucket;
  }

  async saveUser(walletAddress: string, data: unknown) {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: `users/${walletAddress}.json`,
          Body: JSON.stringify(data),
          ContentType: "application/json",
        }),
      );
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  async getUser(walletAddress: string) {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: `users/${walletAddress}.json`,
        }),
      );
      return JSON.parse(await response.Body!.transformToString());
    } catch (error) {
      if ((error as { name?: string })?.name === "NoSuchKey") {
        return null;
      }
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async listUsers() {
    try {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: "users/",
        }),
      );

      const users = [];
      for (const item of response.Contents ?? []) {
        const key = item.Key;
        if (key && key.endsWith(".json")) {
          const walletAddress = key.replace("users/", "").replace(".json", "");
          const user = await this.getUser(walletAddress);
          if (user) {
            users.push(user);
          }
        }
      }
      return users;
    } catch (error) {
      console.error("Error listing users:", error);
      return [];
    }
  }
}

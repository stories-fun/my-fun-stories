import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    CLOUDFLARE_ACCOUNT_ID: z.string(),
    CLOUDFLARE_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
    CLOUDFLARE_BUCKET_NAME: z.string(),
    HUME_API_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    QDRANT_API_KEY: z.string().optional(),
    QDRANT_CLOUD_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_RPC_URL: z.string(),
    NEXT_PUBLIC_PROGRAM_ID: z.string(),
    NEXT_PUBLIC_ADMIN_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_TOKEN_MINT: z.string(),
    NEXT_PUBLIC_SOCKET_URL: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    CLOUDFLARE_BUCKET_NAME: process.env.CLOUDFLARE_BUCKET_NAME,
    HUME_API_KEY: process.env.HUME_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID,
    NEXT_PUBLIC_ADMIN_PUBLIC_KEY: process.env.NEXT_PUBLIC_ADMIN_PUBLIC_KEY,
    NEXT_PUBLIC_TOKEN_MINT: process.env.NEXT_PUBLIC_TOKEN_MINT,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    QDRANT_API_KEY: process.env.QDRANT_API_KEY,
    QDRANT_CLOUD_URL: process.env.QDRANT_CLOUD_URL,
  },
});

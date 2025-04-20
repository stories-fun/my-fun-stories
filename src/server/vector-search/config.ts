import { env } from "../../env";

// Fallback to process.env if env module fails
const getEnv = () => {
  try {
    return {
      openaiApiKey: env.OPENAI_API_KEY,
      qdrantApiKey: env.QDRANT_API_KEY,
      qdrantUrl: env.QDRANT_CLOUD_URL,
    };
  } catch (e) {
    console.warn("Warning: Using process.env fallback due to env module error");
    return {
      openaiApiKey: process.env.OPENAI_API_KEY,
      qdrantApiKey: process.env.QDRANT_API_KEY,
      qdrantUrl: process.env.QDRANT_CLOUD_URL,
    };
  }
};

const envVars = getEnv();

export const OPENAI_CONFIG = {
  apiKey: envVars.openaiApiKey,
  embeddingModel: "text-embedding-3-small",
  maxTokens: 8191, // Maximum tokens for text-embedding-3-small
};

export const VECTOR_SEARCH_CONFIG = {
  embeddingModel: "text-embedding-3-small",
  dimension: 1536,
  similarityThreshold: 0.3,
  maxResults: 10,
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  qdrantUrl: process.env.QDRANT_URL ?? "",
  qdrantApiKey: process.env.QDRANT_API_KEY ?? "",
  // Force useQdrant to false when in debug mode
  useQdrant:
    process.env.VECTOR_SEARCH_DEBUG !== "true" &&
    !!process.env.QDRANT_URL &&
    !!process.env.QDRANT_API_KEY,
  collectionName: "stories",

  // Caching
  enableQueryCache: true,
  queryCacheTtl: 60 * 60 * 1000, // 1 hour in milliseconds
};

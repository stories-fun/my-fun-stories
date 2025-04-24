import OpenAI from "openai";
import { VECTOR_SEARCH_CONFIG } from "./config";
import type { EmbeddingResponse } from "./types";
import { QueryCache } from "./query-cache";

export class OpenAIService {
  private client: OpenAI;
  private queryCache: QueryCache;

  constructor() {
    if (!VECTOR_SEARCH_CONFIG.openaiApiKey) {
      throw new Error("OpenAI API key is not configured");
    }
    console.log("Initializing OpenAI client...");
    this.client = new OpenAI({
      apiKey: VECTOR_SEARCH_CONFIG.openaiApiKey,
    });
    this.queryCache = new QueryCache();
  }

  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    // Check cache first
    const cachedEmbedding = this.queryCache.get(text);
    if (cachedEmbedding) {
      console.log(
        "Using cached embedding for:",
        text.substring(0, 30) + (text.length > 30 ? "..." : ""),
      );
      return cachedEmbedding;
    }

    console.log("Generating embedding for text length:", text.length);
    try {
      const response = await this.client.embeddings.create({
        model: VECTOR_SEARCH_CONFIG.embeddingModel,
        input: text,
        dimensions: VECTOR_SEARCH_CONFIG.dimension,
      });

      console.log("Embedding generated successfully:", {
        model: response.model,
        usage: response.usage,
      });

      if (!response.data[0]?.embedding) {
        throw new Error("No embedding generated");
      }

      const embedding = {
        embedding: response.data[0].embedding,
        usage: response.usage,
      };

      // Cache the result
      this.queryCache.set(text, embedding);

      return embedding;
    } catch (error) {
      console.error("Failed to generate embedding:", error);
      throw error;
    }
  }

  async generateEmbeddings(texts: string[]): Promise<EmbeddingResponse[]> {
    // For batch embeddings, we'll check cache for each individual text
    const results: EmbeddingResponse[] = [];
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];

    // Check cache for each text
    texts.forEach((text, index) => {
      const cachedEmbedding = this.queryCache.get(text);
      if (cachedEmbedding) {
        results[index] = cachedEmbedding;
      } else {
        uncachedTexts.push(text);
        uncachedIndices.push(index);
      }
    });

    // If all embeddings were cached, return immediately
    if (uncachedTexts.length === 0) {
      return results;
    }

    try {
      // Generate embeddings for uncached texts
      const response = await this.client.embeddings.create({
        model: VECTOR_SEARCH_CONFIG.embeddingModel,
        input: uncachedTexts,
      });

      // Process and cache the results
      response.data.forEach((data, dataIndex) => {
        const originalIndex = uncachedIndices[dataIndex];
        if (originalIndex !== undefined) {
          const text = uncachedTexts[dataIndex];

          if (text) {
            const embedding = {
              embedding: data.embedding,
              usage: response.usage ?? { prompt_tokens: 0, total_tokens: 0 },
            };

            // Cache the result
            this.queryCache.set(text, embedding);

            // Add to results
            results[originalIndex] = embedding;
          }
        }
      });

      return results;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw error;
    }
  }
}

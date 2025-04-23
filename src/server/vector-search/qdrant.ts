import { QdrantClient } from "@qdrant/js-client-rest";
import { VECTOR_SEARCH_CONFIG } from "./config";
import type { StoryVector } from "./types";
import { StoryMetadata, SearchResult } from "./local-vector-service";

// Define search params interface for better typing
interface SearchParamsFilter {
  profession?: string | string[];
  interests?: string[];
  gender?: string;
  age?: number | { min?: number; max?: number };
  [key: string]: unknown;
}

/**
 * Service for interacting with Qdrant vector database
 */
export class QdrantService {
  private client: QdrantClient;
  private collectionName: string;
  private initialized = false;
  private dimension: number;

  constructor() {
    if (!VECTOR_SEARCH_CONFIG.qdrantUrl || !VECTOR_SEARCH_CONFIG.qdrantApiKey) {
      throw new Error("Qdrant URL and API key must be configured");
    }

    this.client = new QdrantClient({
      url: VECTOR_SEARCH_CONFIG.qdrantUrl,
      apiKey: VECTOR_SEARCH_CONFIG.qdrantApiKey,
    });

    this.collectionName = VECTOR_SEARCH_CONFIG.collectionName;
    this.dimension = VECTOR_SEARCH_CONFIG.dimension;
  }

  /**
   * Initialize the Qdrant collection if it doesn't exist
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check if collection exists
      const collections = await this.client.getCollections();
      const collectionExists = collections.collections.some(
        (collection) => collection.name === this.collectionName,
      );

      if (!collectionExists) {
        console.log(`Creating Qdrant collection: ${this.collectionName}`);
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: this.dimension,
            distance: "Cosine",
          },
          optimizers_config: {
            indexing_threshold: 0, // Index all vectors
          },
        });

        // Create metadata payload index for faster filtering
        await this.client.createPayloadIndex(this.collectionName, {
          field_name: "metadata.title",
          field_schema: "keyword",
        });

        await this.client.createPayloadIndex(this.collectionName, {
          field_name: "metadata.extractedMetadata.profession",
          field_schema: "keyword",
        });

        await this.client.createPayloadIndex(this.collectionName, {
          field_name: "metadata.extractedMetadata.interests",
          field_schema: "keyword",
        });

        await this.client.createPayloadIndex(this.collectionName, {
          field_name: "metadata.extractedMetadata.gender",
          field_schema: "keyword",
        });
      }

      this.initialized = true;
      console.log("Qdrant service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Qdrant service:", error);
      throw error;
    }
  }

  /**
   * Add a single story vector to Qdrant
   */
  async addStory(story: StoryVector): Promise<void> {
    await this.initialize();

    try {
      await this.client.upsert(this.collectionName, {
        points: [
          {
            id: story.id,
            vector: story.embedding,
            payload: {
              metadata: {
                ...story.metadata,
                // Convert Date to ISO string for storage
                createdAt: story.metadata.createdAt.toISOString(),
              },
            },
          },
        ],
      });
    } catch (error) {
      console.error(`Failed to add story ${story.id} to Qdrant:`, error);
      throw error;
    }
  }

  /**
   * Add multiple story vectors to Qdrant in batch
   */
  async addStories(stories: StoryVector[]): Promise<void> {
    await this.initialize();

    try {
      await this.client.upsert(this.collectionName, {
        points: stories.map((story) => ({
          id: story.id,
          vector: story.embedding,
          payload: {
            metadata: {
              ...story.metadata,
              // Convert Date to ISO string for storage
              createdAt: story.metadata.createdAt.toISOString(),
            },
          },
        })),
      });
    } catch (error) {
      console.error(`Failed to add stories to Qdrant:`, error);
      throw error;
    }
  }

  /**
   * Search for stories by vector similarity and metadata filters
   */
  async search(
    queryVector: number[],
    searchParams: SearchParamsFilter = {},
    limit = VECTOR_SEARCH_CONFIG.maxResults,
    threshold = VECTOR_SEARCH_CONFIG.similarityThreshold,
  ): Promise<SearchResult[]> {
    await this.initialize();

    try {
      // Build filter conditions based on searchParams
      const filter = this.buildFilterFromSearchParams(searchParams);

      const searchResult = await this.client.search(this.collectionName, {
        vector: queryVector,
        limit: limit,
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        score_threshold: threshold,
      });

      // Map results to SearchResult type
      return searchResult.map((result) => {
        // Add typing for payload.metadata with proper fallbacks
        const payload = result.payload ?? {};
        const metadata = (payload.metadata || {}) as Partial<StoryMetadata>;

        const storyMetadata: StoryMetadata = {
          id: String(result.id),
          title: metadata.title ?? "Unknown Title",
          content: metadata.content ?? "No content available",
          username: metadata.username ?? "anonymous",
          walletAddress: metadata.walletAddress ?? "",
          createdAt:
            metadata.createdAt instanceof Date
              ? metadata.createdAt
              : metadata.createdAt && typeof metadata.createdAt === "string"
                ? new Date(metadata.createdAt)
                : new Date(),
          extractedMetadata: {
            topics: Array.isArray(metadata.extractedMetadata?.topics)
              ? metadata.extractedMetadata.topics
              : [],
            summary: Array.isArray(metadata.extractedMetadata?.summary)
              ? metadata.extractedMetadata.summary
              : [`Information about ${metadata.title ?? "this story"}`],
          },
        };

        return {
          id: String(result.id),
          score: result.score,
          embedding: queryVector, // We don't get the vector back from Qdrant search
          metadata: storyMetadata,
        };
      });
    } catch (error) {
      console.error("Failed to search in Qdrant:", error);
      throw error;
    }
  }

  /**
   * Remove a story from Qdrant
   */
  async removeStory(id: string): Promise<void> {
    await this.initialize();

    try {
      await this.client.delete(this.collectionName, {
        points: [id],
      });
    } catch (error) {
      console.error(`Failed to remove story ${id} from Qdrant:`, error);
      throw error;
    }
  }

  /**
   * Clear all vectors from the collection
   */
  async clear(): Promise<void> {
    await this.initialize();

    try {
      // Delete and recreate the collection
      await this.client.deleteCollection(this.collectionName);
      await this.initialize();
    } catch (error) {
      console.error("Failed to clear Qdrant collection:", error);
      throw error;
    }
  }

  /**
   * Get the count of vectors in the collection
   */
  async getVectorCount(): Promise<number> {
    await this.initialize();

    try {
      const collectionInfo = await this.client.getCollection(
        this.collectionName,
      );
      return collectionInfo.points_count ?? 0;
    } catch (error) {
      console.error("Failed to get vector count from Qdrant:", error);
      return 0;
    }
  }

  /**
   * Convert search parameters to Qdrant filter format
   */
  private buildFilterFromSearchParams(
    searchParams: SearchParamsFilter,
  ): Record<string, unknown> {
    const filter: Record<string, unknown> = { must: [] };
    const must = filter.must as Array<unknown>;

    if (!searchParams || Object.keys(searchParams).length === 0) {
      return {};
    }

    // Add profession filter
    if (searchParams.profession) {
      if (typeof searchParams.profession === "string") {
        must.push({
          key: "metadata.extractedMetadata.profession",
          match: {
            text: searchParams.profession.toLowerCase(),
          },
        });
      } else if (
        Array.isArray(searchParams.profession) &&
        searchParams.profession.length > 0
      ) {
        must.push({
          any: searchParams.profession.map((p: string) => ({
            key: "metadata.extractedMetadata.profession",
            match: {
              text: p.toLowerCase(),
            },
          })),
        });
      }
    }

    // Add interests filter
    if (
      searchParams.interests &&
      Array.isArray(searchParams.interests) &&
      searchParams.interests.length > 0
    ) {
      must.push({
        any: searchParams.interests.map((interest: string) => ({
          key: "metadata.extractedMetadata.interests",
          match: {
            text: interest.toLowerCase(),
          },
        })),
      });
    }

    // Add gender filter
    if (searchParams.gender) {
      must.push({
        key: "metadata.extractedMetadata.gender",
        match: {
          text: searchParams.gender.toLowerCase(),
        },
      });
    }

    // Add other filters as needed...

    // Return empty filter if no conditions were added
    if (must.length === 0) {
      return {};
    }

    return filter;
  }
}

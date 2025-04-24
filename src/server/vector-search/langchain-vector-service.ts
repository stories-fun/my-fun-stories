import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "langchain/document";
import { loadedStories } from "./loaded-stories";

// Define interfaces
export interface StoryVector {
  id: string;
  metadata: StoryMetadata;
  score: number;
}

export interface StoryMetadata {
  title: string;
  content: string;
  username: string;
  createdAt: Date | string;
  walletAddress: string;
  extractedMetadata?: {
    topics?: string[];
    summary?: string;
    [key: string]: string[] | string | undefined;
  };
}

// Replace the empty interface with a type alias
export type SearchResult = StoryVector;

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  intent?: string;
  filters?: Record<string, string[]>;
}

// Main vector search service
export class LangchainVectorService {
  private embeddings: OpenAIEmbeddings;
  private vectorStore: MemoryVectorStore | null = null;
  private model: ChatOpenAI;
  private initialized = false;
  private stories: Document[] = [];

  // Singleton instance
  private static instance: LangchainVectorService | null = null;

  static getInstance(): LangchainVectorService {
    if (!LangchainVectorService.instance) {
      LangchainVectorService.instance = new LangchainVectorService();
    }
    return LangchainVectorService.instance;
  }

  constructor() {
    console.log("Initializing LangchainVectorService");

    // Initialize OpenAI embeddings with API key from environment variable
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      // Use ada embedding model for cost efficiency
      modelName: "text-embedding-ada-002",
    });

    // Initialize ChatGPT model for search result enhancement
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.0, // Set to 0 for maximum determinism and precision
    });

    // Initialize with loaded stories
    void this.loadStoriesAndCreateVectors();
  }

  private async loadStoriesAndCreateVectors() {
    try {
      console.log(
        `Loading ${loadedStories.length} stories into vector search...`,
      );

      // Prepare documents for vector store
      this.stories = loadedStories.map((story) => {
        const content = `Title: ${story.title}\nContent: ${story.content}\nUsername: ${story.username}`;
        return new Document({
          pageContent: content,
          metadata: {
            id: story.id,
            title: story.title,
            username: story.username,
            createdAt: story.createdAt,
            walletAddress: story.walletAddress,
          },
        });
      });

      // Always use in-memory vector store for simplicity and compatibility
      console.log("Using in-memory vector storage");
      this.vectorStore = await MemoryVectorStore.fromDocuments(
        this.stories,
        this.embeddings,
      );

      this.initialized = true;
      console.log("Vector search initialized successfully");
    } catch (error) {
      console.error("Failed to initialize vector search:", error);
      this.initialized = false;
    }
  }

  async search(
    query: string,
    options: SearchOptions = {},
  ): Promise<SearchResult[]> {
    console.log(`Searching for: "${query}"`);

    if (!this.initialized || !this.vectorStore) {
      console.log("Vector search not initialized yet, initializing now...");
      await this.loadStoriesAndCreateVectors();

      if (!this.initialized || !this.vectorStore) {
        console.error("Failed to initialize vector search");
        return [];
      }
    }

    try {
      // Use a higher default threshold for stricter relevance
      const { limit = 10, threshold = 0.3 } = options;

      // Log the settings being used
      console.log(
        `Search parameters: threshold=${threshold}, limit=${limit}, strict mode=true`,
      );

      // Create a retriever with the vector store
      const retriever = this.vectorStore.asRetriever({
        k: limit * 2, // Get more candidates to filter through
      });

      // For simple search, just use the retriever directly
      const docs = await retriever.getRelevantDocuments(query);

      // Convert to search results
      const results = docs
        .map((doc, index) => {
          // Find the original story from loaded stories
          const storyId = doc.metadata.id as string;
          const originalStory = loadedStories.find((s) => s.id === storyId);

          if (!originalStory) {
            console.error(`Could not find original story with ID ${storyId}`);
            return null;
          }

          // Calculate a score based on position (since Langchain doesn't return scores)
          // This is a simple inverse mapping where first result = 1.0, last result approaches threshold
          const scoreRange = 1.0 - threshold;
          const score = 1.0 - (index / (docs.length || 1)) * scoreRange;

          // Apply strict filtering - only include results with very high scores
          if (score < threshold) {
            return null;
          }

          return {
            id: storyId,
            score,
            metadata: {
              title: originalStory.title,
              content: originalStory.content,
              username: originalStory.username,
              createdAt: originalStory.createdAt,
              walletAddress: originalStory.walletAddress,
              extractedMetadata: {
                topics: [originalStory.title.split(" ")[0]],
                summary: `This is a story about ${originalStory.title}`,
              },
            },
          };
        })
        .filter(Boolean) as SearchResult[];

      console.log(
        `Found ${results.length} highly relevant results for query: "${query}"`,
      );

      // Slice down to the requested limit after filtering
      const limitedResults = results.slice(0, limit);

      return limitedResults;
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  async addStory(metadata: StoryMetadata): Promise<string> {
    const { content, title, username, createdAt, walletAddress } = metadata;
    const id = Math.random().toString(36).substring(2, 15);

    const newStory = {
      id,
      title,
      content,
      username,
      createdAt:
        typeof createdAt === "string" ? createdAt : createdAt.toISOString(),
      walletAddress,
    };

    // Add to loaded stories
    loadedStories.push(newStory);

    // Create a document for the vector store
    const document = new Document({
      pageContent: `Title: ${title}\nContent: ${content}\nUsername: ${username}`,
      metadata: {
        id,
        title,
        username,
        createdAt: newStory.createdAt,
        walletAddress,
      },
    });

    // Add to vector store if initialized
    if (this.initialized && this.vectorStore) {
      await this.vectorStore.addDocuments([document]);
    }

    return id;
  }

  getVectorCount(): number {
    return loadedStories.length;
  }
}

export default LangchainVectorService;

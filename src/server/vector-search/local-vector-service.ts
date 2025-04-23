import * as fs from "fs";
import * as path from "path";
import { loadedStories } from "./loaded-stories";
import type { StoryMetadata as TypesStoryMetadata } from "./types";

// Using process.cwd() instead of import.meta.url
const __dirname = process.cwd();

// Interfaces
export interface StoryVector {
  id: string;
  embedding: number[];
  metadata: StoryMetadata;
}

// Extend the TypesStoryMetadata to ensure compatibility
export interface StoryMetadata extends TypesStoryMetadata {
  id: string;
}

export interface SearchResult extends StoryVector {
  score: number;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  intent?: string;
  filters?: Record<string, string[]>;
}

// Generate embeddings - local implementation
function generateEmbedding(text: string, dimension = 1536): number[] {
  const embedding = new Array(dimension).fill(0);
  const words = text.toLowerCase().split(/\s+/);

  // Single words (unigrams)
  for (const word of words) {
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j);
      const index = (charCode * 11 + j * 7) % dimension;
      embedding[index] += 0.5;
    }
  }

  // Word pairs (bigrams)
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words[i] + " " + words[i + 1];
    const hash = simpleHash(bigram) % dimension;
    embedding[hash] += 1.0;
  }

  // Word triplets (trigrams)
  for (let i = 0; i < words.length - 2; i++) {
    const trigram = words[i] + " " + words[i + 1] + " " + words[i + 2];
    const hash = simpleHash(trigram) % dimension;
    embedding[hash] += 1.5;
  }

  // Capture key terms
  const keyTerms = [
    "country",
    "nation",
    "culture",
    "exchange",
    "international",
    "global",
    "connect",
    "bridge",
    "between",
    "food",
    "cuisine",
    "music",
    "art",
    "collaboration",
    "japan",
    "finland",
    "mexico",
    "korea",
    "brazil",
    "senegal",
  ];

  for (const term of keyTerms) {
    if (text.toLowerCase().includes(term)) {
      const hash = simpleHash(term) % dimension;
      embedding[hash] += 2.0;
    }
  }

  // Normalize the embedding
  const magnitude = Math.sqrt(
    embedding.reduce<number>((sum, val) => sum + val * val, 0),
  );
  return embedding.map((val): number => (magnitude > 0 ? val / magnitude : 0));
}

// Simple string hash function
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Calculate cosine similarity
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += (vec1[i] ?? 0) * (vec2[i] ?? 0);
  }

  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    mag1 += Math.pow(vec1[i] ?? 0, 2);
    mag2 += Math.pow(vec2[i] ?? 0, 2);
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dotProduct / (mag1 * mag2);
}

// Singleton instance
let instance: LocalVectorSearchService | null = null;

export class LocalVectorSearchService {
  private vectors: Map<string, StoryVector> = new Map<string, StoryVector>();

  constructor() {
    console.log("LocalVectorSearchService initialized");
    void this.loadStoriesFromMemory();
  }

  static getInstance(): LocalVectorSearchService {
    if (!instance) {
      instance = new LocalVectorSearchService();
    }
    return instance;
  }

  private async loadStoriesFromMemory(): Promise<void> {
    console.log(
      `Loading ${loadedStories.length} stories into vector search...`,
    );
    for (const story of loadedStories) {
      await this.addStory({
        id: story.id,
        title: story.title,
        content: story.content,
        username: story.username,
        createdAt: new Date(story.createdAt),
        walletAddress: story.walletAddress,
      });
    }
    console.log(`Loaded ${this.vectors.size} stories into vector search`);
  }

  async addStory(metadata: StoryMetadata): Promise<string> {
    const { content, title } = metadata;
    const textToEmbed = `${title}. ${content}`;

    const embedding = generateEmbedding(textToEmbed);

    const vector: StoryVector = {
      id: metadata.id,
      embedding,
      metadata: {
        ...metadata,
        extractedMetadata: {
          topics: [metadata.title.split(" ")[0]],
          summary: [`This is a story about ${metadata.title}`],
        } as { topics: string[]; summary: string[] },
      },
    };

    this.vectors.set(metadata.id, vector);
    return metadata.id;
  }

  async search(
    query: string,
    options: SearchOptions = {},
  ): Promise<SearchResult[]> {
    const { limit = 10, threshold = 0.1 } = options;
    console.log(`Searching for: "${query}" (threshold: ${threshold})`);
    console.log(`Current vector count: ${this.vectors.size}`);

    const queryEmbedding = generateEmbedding(query);

    const results: SearchResult[] = [];

    for (const vector of Array.from(this.vectors.values())) {
      const score = cosineSimilarity(queryEmbedding, vector.embedding);
      if (score >= threshold) {
        results.push({
          ...vector,
          score,
        });
      }
    }

    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log(
      `Found ${sortedResults.length} results above threshold ${threshold}`,
    );
    return sortedResults;
  }

  getVectorCount(): number {
    return this.vectors.size;
  }
}

export default LocalVectorSearchService;

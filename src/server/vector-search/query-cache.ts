import type { EmbeddingResponse } from "./types";

/**
 * A simple in-memory cache for query embeddings to avoid redundant API calls
 */
export class QueryCache {
  private cache: Map<string, EmbeddingResponse>;
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.cache = new Map<string, EmbeddingResponse>();
    this.maxSize = maxSize;
    console.log(`Initialized query cache with max size: ${maxSize}`);
  }

  /**
   * Get a cached embedding for a query
   */
  get(query: string): EmbeddingResponse | undefined {
    return this.cache.get(query);
  }

  /**
   * Cache an embedding for a query
   */
  set(query: string, embedding: EmbeddingResponse): void {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(query, embedding);
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the current size of the cache
   */
  size(): number {
    return this.cache.size;
  }
}

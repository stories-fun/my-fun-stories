import { EmbeddingResponse } from "./types";
import { VECTOR_SEARCH_CONFIG } from "./config";

interface CacheEntry {
  embedding: EmbeddingResponse;
  timestamp: number;
}

/**
 * Cache for query embeddings to avoid regenerating embeddings for the same queries
 */
export class QueryCache {
  private cache: Map<string, CacheEntry>;
  private ttl: number;
  private enabled: boolean;

  constructor() {
    this.cache = new Map();
    this.ttl = VECTOR_SEARCH_CONFIG.queryCacheTtl;
    this.enabled = VECTOR_SEARCH_CONFIG.enableQueryCache;
  }

  /**
   * Get a cached embedding for a query if it exists and is not expired
   */
  get(query: string): EmbeddingResponse | null {
    if (!this.enabled) return null;

    const entry = this.cache.get(query);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(query);
      return null;
    }

    return entry.embedding;
  }

  /**
   * Cache an embedding for a query
   */
  set(query: string, embedding: EmbeddingResponse): void {
    if (!this.enabled) return;

    this.cache.set(query, {
      embedding,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cached embeddings
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of cached embeddings
   */
  size(): number {
    return this.cache.size;
  }
}

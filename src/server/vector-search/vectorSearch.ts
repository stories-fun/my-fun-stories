import { OpenAIService } from "./openai";
import { MetadataExtractor } from "./metadata-extraction";
import { VECTOR_SEARCH_CONFIG } from "./config";
import { QdrantService } from "./qdrant";
import type { StoryVector, VectorSearchOptions, SearchParams } from "./types";
import type { SearchResult } from "./local-vector-service";

export class VectorSearchService {
  private vectors: Map<string, StoryVector>;
  protected openai: OpenAIService;
  private metadataExtractor: MetadataExtractor;
  private config: typeof VECTOR_SEARCH_CONFIG;
  private qdrantService: QdrantService | null = null;
  private useQdrant: boolean;
  private debugMode: boolean;

  constructor() {
    // Check if we're in debug mode
    this.debugMode = false;

    if (!VECTOR_SEARCH_CONFIG.openaiApiKey && !this.debugMode) {
      throw new Error("OpenAI API key is not configured");
    }

    this.vectors = new Map();
    this.openai = new OpenAIService();
    this.metadataExtractor = new MetadataExtractor();
    this.config = VECTOR_SEARCH_CONFIG;
    this.useQdrant = VECTOR_SEARCH_CONFIG.useQdrant;

    // Initialize Qdrant if configured
    if (this.useQdrant) {
      try {
        this.qdrantService = new QdrantService();
        console.log("Qdrant service initialized");
      } catch (error) {
        console.error("Failed to initialize Qdrant service:", error);
        this.useQdrant = false; // Fall back to in-memory vectors
      }
    }

    console.log("VectorSearchService initialized with config:", {
      embeddingModel: this.config.embeddingModel,
      dimension: this.config.dimension,
      similarityThreshold: this.config.similarityThreshold,
      maxResults: this.config.maxResults,
      useQdrant: this.useQdrant,
      debugMode: this.debugMode,
    });
  }

  // Generate a fake embedding for testing purposes
  private generateFakeEmbedding(text: string): number[] {
    // Create a deterministic but somewhat unique embedding based on the text
    const embedding = Array(this.config.dimension).fill(0) as number[];

    // Use a simple hash function to populate the embedding
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const index = (charCode * 17) % this.config.dimension;
      if (index >= 0 && index < embedding.length) {
        embedding[index] = ((embedding[index] ?? 0) + charCode / 255) % 1;
      }
    }

    // Normalize the embedding
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0),
    );
    return embedding.map((val) => (magnitude > 0 ? val / magnitude : 0));
  }

  protected getVectorsForTest(): StoryVector[] {
    return Array.from(this.vectors.values());
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
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

  async addStory(story: StoryVector): Promise<void> {
    // Add to in-memory vectors for local usage
    this.vectors.set(story.id, story);

    // Add to Qdrant if enabled
    if (this.useQdrant && this.qdrantService) {
      try {
        await this.qdrantService.addStory(story);
      } catch (error) {
        console.error(`Failed to add story ${story.id} to Qdrant:`, error);
      }
    }
  }

  async addStories(stories: StoryVector[]): Promise<void> {
    console.log("Adding stories to vector search:", stories.length);

    for (const story of stories) {
      if (story.embedding.length === 0) {
        // Generate embeddings if they don't exist
        if (this.debugMode) {
          // Use fake embeddings in debug mode
          const title = story.metadata.title || "Untitled";
          console.log(`Generating fake embedding for story: "${title}"`);
          story.embedding = this.generateFakeEmbedding(
            story.metadata.content || "",
          );
        } else {
          try {
            const embedding = await this.openai.generateEmbedding(
              story.metadata.content || "",
            );
            story.embedding = embedding.embedding;
          } catch (error) {
            console.error(
              `Failed to generate embedding for story ${story.id}:`,
              error,
            );
            // Use fake embedding as fallback even in non-debug mode
            story.embedding = this.generateFakeEmbedding(
              story.metadata.content || "",
            );
          }
        }
      }

      if (!story.metadata.extractedMetadata) {
        try {
          if (this.debugMode) {
            // Generate basic metadata in debug mode
            const title = story.metadata.title || "Untitled";
            const firstWord = title.split(" ")[0] ?? "Story";
            story.metadata = {
              ...story.metadata,
              extractedMetadata: {
                topics: [firstWord],
                genres: ["debug"],
                summary: [`This is a summary of ${title}`],
              },
            };
            console.log(`Generated fake metadata for story: "${title}"`);
          } else {
            const extractedMetadata =
              await this.metadataExtractor.extractMetadata(
                story.metadata.content || "",
                story.metadata.title || "Untitled",
              );
            story.metadata = {
              ...story.metadata,
              extractedMetadata,
            };
          }
        } catch (error) {
          console.error(
            `Failed to extract metadata for story ${story.id}:`,
            error,
          );
          // Provide basic metadata even if extraction fails
          const title = story.metadata.title || "Untitled";
          const firstWord = title.split(" ")[0] ?? "Story";
          story.metadata = {
            ...story.metadata,
            extractedMetadata: {
              topics: [firstWord],
              genres: ["debug"],
              summary: [`This is a fallback summary for ${title}`],
            },
          };
        }
      }

      // Add to in-memory vectors
      this.vectors.set(story.id, story);
    }

    // Add to Qdrant in batch if enabled
    if (this.useQdrant && this.qdrantService && stories.length > 0) {
      try {
        await this.qdrantService.addStories(stories);
      } catch (error) {
        console.error("Failed to add stories to Qdrant:", error);
      }
    }

    console.log("Total vectors after adding:", this.vectors.size);
    console.log(
      "Sample extracted metadata:",
      Array.from(this.vectors.values())
        .slice(0, 1)
        .map((v) => ({
          title: v.metadata.title,
          metadata: v.metadata.extractedMetadata,
        })),
    );
  }

  async search(
    query: string,
    options: VectorSearchOptions = {},
  ): Promise<SearchResult[]> {
    console.log("Starting search for query:", query);
    console.log("Current vector count:", this.vectors.size);

    const {
      limit = this.config.maxResults,
      similarityThreshold = this.config.similarityThreshold,
    } = options;

    const { modifiedQuery, searchParams } =
      await this.metadataExtractor.extractQueryParams(query);

    console.log("Analyzed query:", { modifiedQuery, searchParams });

    // Generate embedding for query
    let queryEmbedding;
    if (this.debugMode) {
      // Use fake embedding in debug mode
      console.log("Using fake embedding for query in debug mode");
      queryEmbedding = { embedding: this.generateFakeEmbedding(modifiedQuery) };
    } else {
      queryEmbedding = await this.openai.generateEmbedding(modifiedQuery);
    }
    console.log("Generated query embedding");

    // Use Qdrant for search if enabled
    if (this.useQdrant && this.qdrantService) {
      try {
        // Cast searchParams to include index signature for compatibility
        const searchParamsWithIndex = searchParams as Record<string, unknown>;

        const results = await this.qdrantService.search(
          queryEmbedding.embedding,
          searchParamsWithIndex,
          limit,
          similarityThreshold,
        );

        console.log("Search results from Qdrant:", {
          totalResults: results.length,
          scores: results.map((r) => ({
            title: r.metadata.title,
            score: r.score,
          })),
        });

        return results;
      } catch (error) {
        console.error(
          "Qdrant search failed, falling back to in-memory search:",
          error,
        );
        // Fall back to in-memory search
      }
    }
    // In-memory search (as fallback or when Qdrant is not enabled)
    const results: SearchResult[] = Array.from(this.vectors.values())
      .map((story) => {
        const { extractedMetadata, ...metadata } = story.metadata;
        return {
          ...story,
          metadata: {
            ...metadata,
            extractedMetadata: extractedMetadata
              ? {
                  topics: extractedMetadata.topics || [],
                  summary: Array.isArray(extractedMetadata.summary)
                    ? extractedMetadata.summary
                    : [extractedMetadata.summary || ""],
                }
              : undefined,
          },
          score: this.cosineSimilarity(
            queryEmbedding.embedding,
            story.embedding,
          ),
        };
      })
      .filter((story) => story.score >= similarityThreshold);

    console.log(
      `Vector search found ${results.length} results above threshold`,
    );

    const filteredResults = this.applyMetadataFilters(results, searchParams);
    console.log(`After metadata filtering: ${filteredResults.length} results`);

    const sortedResults = filteredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log("Search results:", {
      totalVectors: this.vectors.size,
      resultsFound: sortedResults.length,
      scores: sortedResults.map((r) => ({
        title: r.metadata.title,
        score: r.score,
      })),
    });

    return sortedResults;
  }

  private applyMetadataFilters(
    results: SearchResult[],
    searchParams: SearchParams,
  ): SearchResult[] {
    if (!searchParams || Object.keys(searchParams).length === 0) {
      return results;
    }

    // Log the search intent to help with debugging
    console.log(
      `Applying filters with search intent: ${searchParams.intent ?? "general"}`,
    );
    if (searchParams.searchDescription) {
      console.log(`Search description: ${searchParams.searchDescription}`);
    }

    return results.filter((result) => {
      const metadata = result.metadata.extractedMetadata;

      if (!metadata) return true;

      // Handle profession filter with improved matching
      if (searchParams.profession && metadata.topics) {
        const professionTopics = metadata.topics.map((t) => t.toLowerCase());

        if (typeof searchParams.profession === "string") {
          if (
            !professionTopics.some(
              (topic) =>
                typeof searchParams.profession === "string" &&
                this.fuzzyMatch(topic, searchParams.profession.toLowerCase()),
            )
          ) {
            return false;
          }
        } else if (
          Array.isArray(searchParams.profession) &&
          searchParams.profession.length > 0
        ) {
          const hasMatchingProfession = searchParams.profession.some(
            (p) =>
              typeof p === "string" &&
              professionTopics.some((topic) =>
                this.fuzzyMatch(topic, p.toLowerCase()),
              ),
          );
          if (!hasMatchingProfession) return false;
        }
      }

      // Handle interests with more nuanced matching
      if (
        searchParams.interests &&
        Array.isArray(searchParams.interests) &&
        searchParams.interests.length > 0
      ) {
        // Look in primary interests
        const hasMatchingInterest = metadata.topics?.some((topic) =>
          searchParams.interests?.some((interest) =>
            this.fuzzyMatch(topic.toLowerCase(), interest.toLowerCase()),
          ),
        );

        // Also look in topics and themes
        const hasMatchingTopic = metadata.topics?.some((topic) =>
          searchParams.interests?.some((interest) =>
            this.fuzzyMatch(topic.toLowerCase(), interest.toLowerCase()),
          ),
        );

        // Check summary field which is now a string array
        const hasMatchingSummary = metadata.summary?.some((theme) =>
          searchParams.interests?.some((interest) =>
            this.fuzzyMatch(theme.toLowerCase(), interest.toLowerCase()),
          ),
        );

        // If we found no matches in any fields, filter out this result
        if (!hasMatchingInterest && !hasMatchingTopic && !hasMatchingSummary) {
          return false;
        }
      }

      // Age filter (unchanged)
      if (searchParams.age && metadata.age) {
        if (typeof searchParams.age === "number") {
          if (metadata.age !== searchParams.age) return false;
        } else {
          if (searchParams.age.min && metadata.age < searchParams.age.min)
            return false;
          if (searchParams.age.max && metadata.age > searchParams.age.max)
            return false;
        }
      }

      // Gender filter
      if (searchParams.gender && metadata.gender) {
        if (
          !this.fuzzyMatch(
            metadata.gender.toLowerCase(),
            searchParams.gender.toLowerCase(),
          )
        ) {
          return false;
        }
      }

      // Relationship status filter
      if (searchParams.relationshipStatus && metadata.relationshipStatus) {
        if (
          !this.fuzzyMatch(
            metadata.relationshipStatus.toLowerCase(),
            searchParams.relationshipStatus.toLowerCase(),
          )
        ) {
          return false;
        }
      }

      // Education filter
      if (searchParams.education && metadata.education) {
        if (
          !this.fuzzyMatch(
            metadata.education.toLowerCase(),
            searchParams.education.toLowerCase(),
          )
        ) {
          return false;
        }
      }

      // Experiences filter with better matching
      if (
        searchParams.experiences &&
        Array.isArray(searchParams.experiences) &&
        searchParams.experiences.length > 0 &&
        metadata.experiences
      ) {
        const hasMatchingExperience = searchParams.experiences.some((exp) =>
          metadata.experiences?.some((e) =>
            this.fuzzyMatch(e.toLowerCase(), exp.toLowerCase()),
          ),
        );
        if (!hasMatchingExperience) return false;
      }

      // Personality traits filter with better matching
      if (
        searchParams.personalityTraits &&
        Array.isArray(searchParams.personalityTraits) &&
        searchParams.personalityTraits.length > 0 &&
        metadata.personalityTraits
      ) {
        const hasMatchingTrait = searchParams.personalityTraits.some((trait) =>
          metadata.personalityTraits?.some((t) =>
            this.fuzzyMatch(t.toLowerCase(), trait.toLowerCase()),
          ),
        );
        if (!hasMatchingTrait) return false;
      }

      // Skills filter
      if (
        searchParams.skills &&
        Array.isArray(searchParams.skills) &&
        searchParams.skills.length > 0 &&
        metadata.skills
      ) {
        const hasMatchingSkill = searchParams.skills.some((skill) =>
          metadata.skills?.some((s) =>
            this.fuzzyMatch(s.toLowerCase(), skill.toLowerCase()),
          ),
        );
        if (!hasMatchingSkill) return false;
      }

      // Location filter
      if (searchParams.location && metadata.location) {
        if (
          !this.fuzzyMatch(
            metadata.location.toLowerCase(),
            searchParams.location.toLowerCase(),
          )
        ) {
          return false;
        }
      }

      // Keywords filter - match against multiple fields
      if (
        searchParams.keywords &&
        Array.isArray(searchParams.keywords) &&
        searchParams.keywords.length > 0
      ) {
        // Look for keywords in multiple fields
        const fieldsToCheck = [
          metadata.profession,
          metadata.location,
          metadata.summary,
          metadata.charactersDescription,
          metadata.narrativeStyle,
        ];

        const arraysToCheck = [
          metadata.interests,
          metadata.experiences,
          metadata.personalityTraits,
          metadata.skills,
          metadata.topics,
          metadata.genres,
          metadata.themes,
          metadata.emotionalTone,
        ];

        // Check each keyword against all relevant fields
        const allKeywordsMatch = searchParams.keywords.every((keyword) => {
          // Check in string fields
          const matchesStringField = fieldsToCheck.some((field) =>
            field && typeof field === "string"
              ? this.fuzzyMatch(field.toLowerCase(), keyword.toLowerCase())
              : false,
          );

          // Check in array fields
          const matchesArrayField = arraysToCheck.some((arr) =>
            arr?.some((item) =>
              this.fuzzyMatch(item.toLowerCase(), keyword.toLowerCase()),
            ),
          );

          return matchesStringField || matchesArrayField;
        });

        if (!allKeywordsMatch) return false;
      }

      return true;
    });
  }

  // Helper method for fuzzy matching strings
  private fuzzyMatch(text: string, query: string): boolean {
    if (!text || !query) return false;

    // Exact match
    if (text.includes(query)) return true;

    // Word boundary match (e.g., "software engineer" should match "engineer")
    const words = text.split(/\s+/);
    for (const word of words) {
      if (word.includes(query) || query.includes(word)) return true;
    }

    // Partial word match for longer queries (3+ chars)
    if (query.length >= 3) {
      // If the query is at least 3 chars and is part of a word in the text
      for (const word of words) {
        if (word.length >= 4 && word.includes(query)) return true;
      }
    }

    return false;
  }

  async removeStory(id: string): Promise<void> {
    // Remove from in-memory vectors
    this.vectors.delete(id);

    // Remove from Qdrant if enabled
    if (this.useQdrant && this.qdrantService) {
      try {
        await this.qdrantService.removeStory(id);
      } catch (error) {
        console.error(`Failed to remove story ${id} from Qdrant:`, error);
      }
    }
  }

  async clear(): Promise<void> {
    // Clear in-memory vectors
    this.vectors.clear();

    // Clear Qdrant collection if enabled
    if (this.useQdrant && this.qdrantService) {
      try {
        await this.qdrantService.clear();
      } catch (error) {
        console.error("Failed to clear Qdrant collection:", error);
      }
    }
  }

  getVectorCount(): number {
    return this.vectors.size;
  }

  public async generateEmbedding(text: string) {
    return this.openai.generateEmbedding(text);
  }
}

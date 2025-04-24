import OpenAI from "openai";
import { VECTOR_SEARCH_CONFIG } from "./config";
import type { StoryMetadata, SearchParams } from "./types";

// Interface for the response from the query analysis
// Commented out as it's not currently used
/* interface QueryAnalysisResult {
  modifiedQuery?: string;
  intent?: SearchParams["intent"];
  profession?: string;
  interests?: string[];
  age?: number | { min?: number; max?: number };
  gender?: string;
  experiences?: string[];
  personalityTraits?: string[];
  skills?: string[];
  location?: string;
  keywords?: string[];
  searchDescription?: string;
  relationshipStatus?: string;
  education?: string;
} */

export class MetadataExtractor {
  private client: OpenAI | null = null;
  private debugMode: boolean;

  constructor() {
    // Check if we're in debug mode
    this.debugMode = false;

    if (!VECTOR_SEARCH_CONFIG.openaiApiKey && !this.debugMode) {
      throw new Error("OpenAI API key is not configured");
    }

    if (!this.debugMode) {
      this.client = new OpenAI({
        apiKey: VECTOR_SEARCH_CONFIG.openaiApiKey,
      });
    }

    console.log("MetadataExtractor initialized", { debugMode: this.debugMode });
  }

  async extractMetadata(
    storyText: string,
    title: string,
  ): Promise<StoryMetadata["extractedMetadata"]> {
    console.log(`Extracting metadata for story: "${title}"`);

    // If in debug mode, return simplified metadata
    if (this.debugMode) {
      console.log("Debug mode: Generating simple metadata");
      const words = title.split(" ");
      const firstWord = words[0] ?? "Story";
      const secondWord = words.length > 1 ? words[1] : "Unknown";
      return {
        profession: secondWord,
        interests: [firstWord],
        topics: [firstWord],
        summary: [`This is a debug summary for ${title}`],
        genres: ["debug"],
        emotionalTone: ["neutral"],
      };
    }

    // Real OpenAI implementation would go here
    // Returning object with required fields
    return {
      topics: [title.split(" ")[0] ?? "General"],
      summary: [`This is a placeholder summary for ${title}`],
    };
  }

  async extractQueryParams(query: string): Promise<{
    modifiedQuery: string;
    searchParams: SearchParams;
  }> {
    console.log(`Analyzing search query: "${query}"`);

    // If in debug mode, provide basic query analysis
    if (this.debugMode) {
      console.log("Debug mode: Generating simple query analysis");
      const words = query.split(" ").filter((word) => word.length > 0);

      // Ensure we have at least some words for debugging
      const safeWords = words.length > 0 ? words : ["search"];

      // Extract potential parameters from the query text
      const hasLocationKeyword =
        query.toLowerCase().includes("location") ||
        query.toLowerCase().includes("country");
      const hasProfessionKeyword =
        query.toLowerCase().includes("profession") ||
        query.toLowerCase().includes("job");
      const hasAgeKeyword =
        query.toLowerCase().includes("age") ||
        query.toLowerCase().includes("years old");
      const hasGenderKeyword =
        query.toLowerCase().includes("gender") ||
        query.toLowerCase().includes("male") ||
        query.toLowerCase().includes("female");

      // Safe index access for words array
      const secondWord = words.length > 1 ? words[1] : "";

      return {
        modifiedQuery: query,
        searchParams: {
          intent: query.toLowerCase().includes("dating")
            ? "dating"
            : query.toLowerCase().includes("professional")
              ? "professional"
              : query.toLowerCase().includes("connect")
                ? "connection"
                : "general",
          interests: secondWord ? [secondWord] : [],
          location: hasLocationKeyword ? "Any" : undefined,
          profession: hasProfessionKeyword ? "Any" : undefined,
          age: hasAgeKeyword ? { min: 18, max: 65 } : undefined,
          gender: hasGenderKeyword ? "Any" : undefined,
          experiences: [],
          personalityTraits: [],
          skills: [],
          keywords: safeWords,
          searchDescription: `Debug search for: ${query}`,
        },
      };
    }

    // Simple default implementation
    return {
      modifiedQuery: query,
      searchParams: {
        intent: "general",
        interests: [],
        experiences: [],
        personalityTraits: [],
        skills: [],
        keywords: [],
      },
    };
  }

  private ensureStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      );
    }
    if (typeof value === "string" && value.trim().length > 0) {
      return [value];
    }
    return [];
  }
}

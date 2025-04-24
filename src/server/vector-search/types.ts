export interface EmbeddingResponse {
  embedding: number[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface StoryMetadata {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: Date;
  walletAddress: string;

  // Extracted structured metadata
  extractedMetadata?: {
    profession?: string;
    interests?: string[];
    age?: number;
    gender?: string;
    experiences?: string[];
    personalityTraits?: string[];
    skills?: string[];
    location?: string;
    relationshipStatus?: string;
    education?: string;
    topics: string[];
    genres?: string[];
    summary: string[];
    narrativeStyle?: string;
    themes?: string[];
    charactersDescription?: string;
    emotionalTone?: string[];
  };
}

export interface StoryVector {
  id: string;
  embedding: number[];
  metadata: StoryMetadata;
}

export interface SearchResult extends StoryVector {
  score: number;
}

export interface SearchParams {
  intent?: "professional" | "dating" | "connection" | "general";
  searchDescription?: string;
  profession?: string | string[];
  interests?: string[];
  age?: number | { min?: number; max?: number };
  gender?: string;
  experiences?: string[];
  personalityTraits?: string[];
  skills?: string[];
  location?: string;
  keywords?: string[];
  relationshipStatus?: string;
  education?: string;
}

export interface VectorSearchOptions {
  limit?: number;
  similarityThreshold?: number;
  searchParams?: SearchParams;
}

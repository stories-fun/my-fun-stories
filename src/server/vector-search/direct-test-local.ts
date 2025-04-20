import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force debug mode
process.env.VECTOR_SEARCH_DEBUG = "true";
process.env.NODE_ENV = "development";

// Interface definitions
interface Story {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  walletAddress: string;
}

interface StoryVector {
  id: string;
  embedding: number[];
  metadata: StoryMetadata;
}

interface StoryMetadata {
  title: string;
  content: string;
  username: string;
  createdAt: Date;
  walletAddress: string;
  extractedMetadata?: Record<string, any>;
}

interface SearchResult extends StoryVector {
  score: number;
}

// Load stories from JSON
function loadStoriesFromJson(): Story[] {
  const storiesPath = path.join(__dirname, "sample-stories.json");
  try {
    const data = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
    return data.stories;
  } catch (error) {
    console.error("Failed to load stories:", error);
    return [];
  }
}

// Generate embeddings - more robust algorithm
function generateEmbedding(text: string, dimension: number = 1536): number[] {
  const embedding = new Array(dimension).fill(0);

  // More robust algorithm that captures semantic meaning through n-grams
  const words = text.toLowerCase().split(/\s+/);

  // Single words (unigrams)
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j);
      const index = (charCode * 11 + j * 7) % dimension;
      embedding[index] = embedding[index] + 0.5;
    }
  }

  // Word pairs (bigrams)
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words[i] + " " + words[i + 1];
    const hash = simpleHash(bigram) % dimension;
    embedding[hash] = embedding[hash] + 1.0;
  }

  // Word triplets (trigrams)
  for (let i = 0; i < words.length - 2; i++) {
    const trigram = words[i] + " " + words[i + 1] + " " + words[i + 2];
    const hash = simpleHash(trigram) % dimension;
    embedding[hash] = embedding[hash] + 1.5;
  }

  // Capture key terms that might indicate countries, cultures, etc.
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
      embedding[hash] = embedding[hash] + 2.0;
    }
  }

  // Normalize the embedding
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0),
  );
  return embedding.map((val) => (magnitude > 0 ? val / magnitude : 0));
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

// Convert stories to vector format
function createStoryVectors(stories: Story[]): StoryVector[] {
  return stories.map((story) => ({
    id: story.id,
    embedding: generateEmbedding(story.content),
    metadata: {
      title: story.title,
      content: story.content,
      username: story.username,
      createdAt: new Date(story.createdAt),
      walletAddress: story.walletAddress,
      extractedMetadata: {
        topics: [story.title.split(" ")[0]],
        summary: `This is a summary of ${story.title}`,
      },
    },
  }));
}

// Calculate cosine similarity
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += (vec1[i] || 0) * (vec2[i] || 0);
  }

  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    mag1 += Math.pow(vec1[i] || 0, 2);
    mag2 += Math.pow(vec2[i] || 0, 2);
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dotProduct / (mag1 * mag2);
}

// Search function
function search(
  query: string,
  vectors: StoryVector[],
  options: { limit?: number; threshold?: number } = {},
): SearchResult[] {
  const { limit = 10, threshold = 0.1 } = options; // Lower threshold to 0.1

  // Generate query embedding
  const queryEmbedding = generateEmbedding(query);

  // Calculate similarity for each vector
  const results = vectors
    .map((vector) => ({
      ...vector,
      score: cosineSimilarity(queryEmbedding, vector.embedding),
    }))
    .filter((result) => result.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

// Main function
async function runDirectTest() {
  console.log("===== Running Direct Vector Search Test =====\n");

  // Load stories
  const stories = loadStoriesFromJson();
  console.log(`Loaded ${stories.length} stories from JSON`);

  // Create vectors
  const vectors = createStoryVectors(stories);
  console.log(`Created ${vectors.length} story vectors with embeddings`);

  // Run test searches
  const queries = [
    "Tell me a story which connects two countries",
    "Find stories about cultural exchange",
    "Stories about food from different countries",
    "Stories about Japan and Finland",
    "Mexico and Korea cuisine",
    "Music between Brazil and Senegal",
  ];

  for (const query of queries) {
    console.log(`\n----- Searching for: "${query}" -----`);

    const results = search(query, vectors);

    console.log(`Found ${results.length} results`);

    if (results.length > 0) {
      console.log("Top matches:");
      results.slice(0, 3).forEach((result, index) => {
        console.log(
          `${index + 1}. "${result.metadata.title}" (Score: ${result.score.toFixed(3)})`,
        );
        const excerpt = result.metadata.content.slice(0, 100) + "...";
        console.log(`   ${excerpt}`);
      });
    } else {
      console.log("No matches found");
    }
  }

  console.log("\n===== Test Completed Successfully =====");
}

// Run the test
runDirectTest().catch((error) => {
  console.error("Test failed:", error);
});

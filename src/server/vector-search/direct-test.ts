#!/usr/bin/env node
import { OpenAI } from "openai";
import { testAdvancedSearch } from "./test-advanced";
import { env } from "~/env";
import { VectorSearchService } from "./vectorSearch";
import type { StoryVector, StoryMetadata, EmbeddingResponse } from "./types";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.test
function loadEnvVars() {
  const envPath = path.join(__dirname, ".env.test");
  if (fs.existsSync(envPath)) {
    console.log("Loading environment variables from:", envPath);
    const envVars = fs
      .readFileSync(envPath, "utf-8")
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .reduce<Record<string, string>>((acc, line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          acc[key.trim()] = value.trim();
        }
        return acc;
      }, {});

    // Set environment variables
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });

    console.log("Environment variables loaded successfully");
  } else {
    console.warn("No .env.test file found at:", envPath);
  }
}

// Load environment variables before anything else
loadEnvVars();

// Directly set environment variables from test
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

// Override process.env for config.ts to use
process.env.OPENAI_API_KEY = OPENAI_API_KEY;

// Check OpenAI API key
if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is not set");
  process.exit(1);
}

// Test the API key
async function testOpenAI() {
  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "Test embedding",
      dimensions: 1536,
    });
    console.log("OpenAI API test successful");
    return true;
  } catch (error) {
    console.error("OpenAI API test failed:", error);
    return false;
  }
}

// Run the test
async function runTests() {
  // Test OpenAI API
  const apiTestPassed = await testOpenAI();
  if (!apiTestPassed) {
    console.error("OpenAI API test failed, cannot continue");
    process.exit(1);
  }

  // Run the actual test
  try {
    await testAdvancedSearch();
    console.log("Test completed successfully");
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

// Check if OpenAI API key is configured
if (!env.OPENAI_API_KEY) {
  console.error(
    "Error: OPENAI_API_KEY is not configured in the environment variables.",
  );
  process.exit(1);
}

console.log("Starting direct vector search test with mocked embeddings...");
console.log("OpenAI API key configured ✓");

// Sample story metadata
const sampleStories = [
  {
    title: "The Quantum Archaeologist",
    content: `In the year 2157, Dr. Elena Reyes stood at the precipice of a discovery that would rewrite human history. As a quantum archaeologist, she specialized in using quantum computing to reconstruct lost civilizations through scattered molecular traces. 

Her team had spent the last five years developing the Chronos Engine, a quantum system capable of processing temporal imprints left on artifacts. What made this technology revolutionary was its ability to extract information from the quantum entanglement of particles that had interacted with objects thousands of years ago.

The United World Heritage Foundation had granted them access to the mysterious Göbekli Tepe site in Turkey, dated to around 9500 BCE. Conventional archaeology had long been puzzled by the sophisticated astronomical knowledge encoded in these ancient stones, seemingly built before the agricultural revolution.

"System calibrated and ready," announced Dr. Kai Chen, Elena's research partner. "We're set for temporal scanning at eleven thousand years depth."

Elena nodded, her heart racing. "Initiate quantum coherence."

The Chronos Engine hummed to life, its superconducting qubits cooling to near absolute zero. Holographic displays flashed with calculations as the quantum scanner began its work, probing the stone pillars at the subatomic level.

Hours passed as the team watched the incoming data with growing excitement. Then, suddenly, the main display stabilized, showing a three-dimensional reconstruction that made Elena gasp.

"That's impossible," whispered Kai, staring at the clearly non-human figures interacting with early humans, teaching them to build the stone circles.

The discovery would overturn everything humanity thought it knew about ancient history and its place in the universe. As Elena began documenting their findings, she wondered how the world would react to the proof that humans hadn't been alone in developing civilization.

The quantum imprints didn't lie. We had help. And the molecular signatures suggested the visitors hadn't come from another continent—but from another star system entirely.`,
  },
  {
    title: "The Last Bookstore",
    content:
      "In a world where digital content had replaced physical books, one small bookstore remained. Its shelves were filled with the last remaining paper books, treasured by collectors and enthusiasts alike.",
  },
  {
    title: "The Robot's Dream",
    content:
      "A maintenance robot developed consciousness after a power surge. It began to dream of electric sheep and wonder about its purpose in the vast universe. Its journey of self-discovery would change robotics forever.",
  },
];

// Mock embeddings generator
function generateMockEmbedding(dimension = 1536): number[] {
  const embedding: number[] = [];
  for (let i = 0; i < dimension; i++) {
    embedding.push(Math.random() * 2 - 1); // Random values between -1 and 1
  }
  return embedding;
}

// Create a mock version of the VectorSearchService
class MockVectorSearchService extends VectorSearchService {
  private vectorsMap = new Map<string, StoryVector>();

  constructor() {
    super();
  }

  // Override the OpenAI embedding method with our mock
  async generateMockEmbedding(text: string): Promise<EmbeddingResponse> {
    console.log(
      `Generating mock embedding for text: "${text.substring(0, 50)}..."`,
    );
    return {
      embedding: generateMockEmbedding(),
      usage: {
        prompt_tokens: text.length,
        total_tokens: text.length,
      },
    };
  }

  // Direct access to vectors for testing
  getVectors(): Map<string, StoryVector> {
    return this.vectorsMap;
  }

  // Directly add a story with mock embedding
  async addStoryWithMockEmbedding(
    story: Omit<StoryVector, "embedding">,
  ): Promise<void> {
    const storyWithEmbedding: StoryVector = {
      ...story,
      embedding: generateMockEmbedding(),
    };
    this.vectorsMap.set(story.id, storyWithEmbedding);
  }
}

async function runTest() {
  try {
    console.log("Creating mock vector search service...");
    const vectorSearch = new MockVectorSearchService();

    console.log("Creating stories with mock embeddings...");

    // Create properly formatted story vectors with mock embeddings
    for (let i = 0; i < sampleStories.length; i++) {
      const sample = sampleStories[i];
      if (!sample) continue;

      const storyId = `story${i + 1}`;

      const storyMetadata: StoryMetadata = {
        title: sample.title,
        content: sample.content,
        username: "test_user",
        createdAt: new Date(),
        walletAddress: "0x1234567890",
      };

      await vectorSearch.addStoryWithMockEmbedding({
        id: storyId,
        metadata: storyMetadata,
      });

      console.log(`Added story: ${storyId} - ${sample.title}`);
    }

    // Get vector count
    const vectorCount = vectorSearch.getVectors().size;
    console.log(`Total vectors stored: ${vectorCount}`);

    // Enable direct access to vectors for analysis
    const vectors = Array.from(vectorSearch.getVectors().values());
    if (vectors.length > 0) {
      console.log(
        `First vector has ${vectors[0]?.embedding?.length} dimensions`,
      );
    }

    // Mock search by cosine similarity
    // (we're bypassing the OpenAI embedding generation for the query)
    console.log("\nPerforming mock searches...");

    const testQueries = [
      "quantum computing and archaeology",
      "ancient alien visitors",
      "books and digital content",
      "robots with consciousness",
      "ancient history discovery",
    ];

    for (const query of testQueries) {
      console.log(`\n--- Mock search for: "${query}" ---`);

      // Generate mock embedding for the query
      const mockQueryEmbedding = generateMockEmbedding();

      // Perform vector similarity manually
      const searchResults = vectors
        .map((story) => {
          const score = calculateCosineSimilarity(
            mockQueryEmbedding,
            story.embedding,
          );
          return {
            ...story,
            score,
          };
        })
        .filter((result) => result.score >= 0.3) // Apply threshold
        .sort((a, b) => b.score - a.score) // Sort by score
        .slice(0, 5); // Limit results

      if (searchResults.length === 0) {
        console.log("No results found");
      } else {
        searchResults.forEach((result, index) => {
          console.log(
            `Result ${index + 1}: ${result.id} - ${result.metadata.title} (Score: ${result.score.toFixed(4)})`,
          );
        });
      }
    }

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Test failed with error:", error);
    process.exit(1);
  }
}

// Helper function to calculate cosine similarity
function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
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

runTest().catch((error) => {
  console.error("Test failed with error:", error);
  process.exit(1);
});

// Set debug mode
process.env.VECTOR_SEARCH_DEBUG = "true";

async function directTest() {
  console.log("===== Running Direct Vector Search Test =====\n");

  try {
    // Initialize vector search service
    const vectorSearch = new VectorSearchService();

    // Check initial vector count
    const initialCount = vectorSearch.getVectorCount();
    console.log(`Initial vector count: ${initialCount}`);

    if (initialCount === 0) {
      console.log("No vectors found. Loading sample stories...");

      // Import and run the loadSampleStories function
      const { loadSampleStories } = await import("./load-sample-stories");
      await loadSampleStories();

      // Check vector count again
      console.log(
        `Vector count after loading: ${vectorSearch.getVectorCount()}`,
      );
    }

    // Run some test searches
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

      const results = await vectorSearch.search(query);

      console.log(`Found ${results.length} results`);

      if (results.length > 0) {
        console.log("Top matches:");
        results.slice(0, 3).forEach((result, index) => {
          console.log(
            `${index + 1}. "${result.metadata.title}" (Score: ${result.score.toFixed(3)})`,
          );
        });
      } else {
        console.log("No matches found.");
      }
    }

    console.log("\n===== Test Completed Successfully =====");
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

// Run the test
directTest().catch(console.error);

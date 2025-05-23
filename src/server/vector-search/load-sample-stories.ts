import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VectorSearchService } from "./vectorSearch";
import type { StoryVector, StoryMetadata } from "./types";

// Get current file directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to sample stories JSON file
const SAMPLE_STORIES_PATH = path.join(__dirname, "sample-stories.json");

// Define the structure of our sample stories
interface SampleStory {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  walletAddress: string;
}

interface SampleStoriesFile {
  stories: SampleStory[];
}

export async function loadSampleStories(): Promise<void> {
  console.log("Loading sample stories into vector search service...");

  try {
    // Read sample stories from JSON file
    const fileContent = fs.readFileSync(SAMPLE_STORIES_PATH, "utf-8");
    const data = JSON.parse(fileContent) as SampleStoriesFile;

    if (!Array.isArray(data.stories) || data.stories.length === 0) {
      throw new Error("No stories found in sample file");
    }

    console.log(`Found ${data.stories.length} sample stories`);

    // Initialize vector search service
    const vectorSearch = new VectorSearchService();

    // Convert stories to the format expected by vector search
    const storyVectors: StoryVector[] = [];

    for (const story of data.stories) {
      // Parse date string to Date object
      const createdAt = new Date(story.createdAt);

      // Create metadata
      const metadata: StoryMetadata = {
        id: story.id,
        title: story.title,
        content: story.content,
        username: story.username,
        createdAt,
        walletAddress: story.walletAddress,
      };

      // We'll let the vector search service handle embedding generation
      storyVectors.push({
        id: story.id,
        embedding: [], // Will be generated by the service
        metadata,
      });
    }

    // Add stories to vector search service
    await vectorSearch.addStories(storyVectors);

    console.log(
      `Successfully loaded ${storyVectors.length} stories into vector search service`,
    );
  } catch (error) {
    console.error("Failed to load sample stories:", error);
    throw error;
  }
}

// Execute the function if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  loadSampleStories()
    .then(() => {
      console.log("Sample stories loading complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error loading sample stories:", error);
      process.exit(1);
    });
}

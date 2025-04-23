// Import the bare minimum of what we need
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define the Story interface
interface Story {
  title: string;
  content: string;
  [key: string]: unknown; // For any additional properties
}

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set environment variables for testing
process.env.VECTOR_SEARCH_DEBUG = "true";

// Load sample stories from JSON
const storiesPath = path.join(__dirname, "sample-stories.json");
const storiesData = JSON.parse(fs.readFileSync(storiesPath, "utf-8")) as { stories: Story[] };
const stories: Story[] = storiesData.stories;

// Simple fuzzy matching function similar to one in vectorSearch.ts
function fuzzyMatch(text: string, query: string): boolean {
  if (!text || !query) return false;

  // Convert both to lowercase for case-insensitive matching
  const textLower: string = text.toLowerCase();
  const queryLower: string = query.toLowerCase();
  
  // Use the lowercase versions for matching

  // Exact match
  if (textLower.includes(queryLower)) return true;

  // Word boundary match
  const words = textLower.split(/\s+/);
  for (const word of words) {
    if (word.includes(queryLower) || queryLower.includes(word)) return true;
  }

  return false;
}

// Search function that simulates vector search
function simpleSearch(query: string): (Story & { score: number; matchesTitle: boolean; matchesContent: boolean })[] {
  console.log(`Searching for: "${query}"`);

  // Keywords to look for
  const keywords: string[] = query.toLowerCase().split(/\s+/);

  // Priorities for different fields
  const weights = {
    title: 5,
    content: 1,
  };

  // Score each story
  const results = stories.map((story: Story) => {
    let score = 0;
    let matchesTitle = false;
    let matchesContent = false;

    // Check title
    if (fuzzyMatch(story.title, query)) {
      score += weights.title;
      matchesTitle = true;
    }

    // Check content
    if (fuzzyMatch(story.content, query)) {
      score += weights.content;
      matchesContent = true;
    }

    // Check individual keywords
    for (const keyword of keywords) {
      if (keyword.length < 3) continue; // Skip short words

      if (fuzzyMatch(story.title, keyword)) {
        score += weights.title * 0.5;
        matchesTitle = true;
      }

      if (fuzzyMatch(story.content, keyword)) {
        score += weights.content * 0.5;
        matchesContent = true;
      }
    }

    // Return result with score
    return {
      ...story,
      score,
      matchesTitle,
      matchesContent,
    };
  });

  // Filter results with score > 0 and sort by score
  return results
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Run test searches
const queries = [
  "Tell me a story which connects two countries",
  "Find stories about cultural exchange",
  "Stories about food from different countries",
  "Stories about Japan and Finland",
  "Mexico and Korea cuisine",
  "Music between Brazil and Senegal",
];

console.log("===== Simple Search Test =====\n");
console.log(`Loaded ${stories.length} stories`);

for (const query of queries) {
  console.log(`\n----- Search Query: "${query}" -----`);

  const results = simpleSearch(query);

  console.log(`Found ${results.length} results`);

  if (results.length > 0) {
    console.log("Top matches:");
    results.slice(0, 3).forEach((result, index) => {
      console.log(
        `${index + 1}. "${result.title}" (Score: ${result.score.toFixed(1)})`,
      );
      // Print a tiny excerpt
      const excerpt = result.content.slice(0, 100) + "...";
      console.log(`   ${excerpt}`);
    });
  } else {
    console.log("No matches found.");
  }
}

console.log("\n===== Test Completed =====");

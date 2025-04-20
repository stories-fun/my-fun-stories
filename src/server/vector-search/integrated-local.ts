import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Interface definitions
interface Story {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  walletAddress: string;
}

// Load stories from JSON
function loadStoriesFromJson(): Story[] {
  const storiesPath = path.join(__dirname, "sample-stories.json");
  try {
    const data = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
    return data.stories || [];
  } catch (error) {
    console.error("Failed to load stories:", error);
    return [];
  }
}

// Load stories into the application
async function loadStories() {
  console.log("Loading stories from JSON into the application...");
  const stories = loadStoriesFromJson();
  console.log(`Found ${stories.length} stories to load`);
  
  if (stories.length === 0) {
    console.error("No stories found in sample-stories.json");
    return false;
  }
  
  // Create API route for the stories
  try {
    // Store stories in a file that can be imported by the application
    const storeData = `export const loadedStories = ${JSON.stringify(stories, null, 2)};`;
    fs.writeFileSync(path.join(__dirname, "loaded-stories.ts"), storeData);
    console.log("Stories prepared for vector search");
    return true;
  } catch (error) {
    console.error("Failed to prepare stories:", error);
    return false;
  }
}

// Run the loader
loadStories().then(success => {
  if (success) {
    console.log("✅ Stories loaded successfully!");
  } else {
    console.error("❌ Failed to load stories");
    process.exit(1);
  }
});

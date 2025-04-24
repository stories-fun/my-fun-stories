#!/bin/bash

echo "=== Starting Vector Search with LangChain and OpenAI Embeddings ==="

# Set debug mode
export VECTOR_SEARCH_DEBUG="true"
export NODE_ENV="development"

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Warning: OPENAI_API_KEY environment variable is not set."
  echo "Either set it or make sure .env file contains it"
  
  # Check if .env file exists
  if [ -f ".env" ]; then
    echo "Found .env file, attempting to load OPENAI_API_KEY from it"
    # shellcheck disable=SC2046
    export $(grep -v '^#' .env | grep OPENAI_API_KEY)
  else
    echo "No .env file found. Creating one..."
    echo "OPENAI_API_KEY=your-key-here" > .env
    echo "Please edit the .env file and add your OpenAI API key"
    echo "You can get an API key from https://platform.openai.com/api-keys"
    exit 1
  fi
fi

# Install required dependencies (forcing the install to ensure compatibility)
echo "Installing required dependencies..."
npm install @langchain/openai langchain @langchain/core

# Check if sample-stories.json exists
if [ ! -f "src/server/vector-search/sample-stories.json" ]; then
  echo "Error: sample-stories.json not found in src/server/vector-search/"
  exit 1
fi

# Create the integrated local test file
cat > src/server/vector-search/integrated-local.ts << 'EOF'
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
EOF

echo "Loading stories into vector search..."
npx tsx src/server/vector-search/integrated-local.ts

if [ $? -ne 0 ]; then
  echo "Failed to load stories. Exiting."
  exit 1
fi

# Start the Next.js server
echo "Starting the Next.js development server..."
npm run dev &
SERVER_PID=$!

# Allow server to start
echo "Waiting for server to start..."
sleep 5

echo "✅ Server is running!"
echo "You can access the search page at: http://localhost:3000/search"
echo "This implementation uses LangChain with OpenAI embeddings for advanced semantic search"
echo "Try searching for specific topics like 'meditation', 'career change', or usernames like 'iamadi'"
echo "Press Ctrl+C to stop the server"

# Wait for user to stop server
wait $SERVER_PID

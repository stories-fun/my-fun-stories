import { testAdvancedSearch } from "./test-advanced";

// Check if OpenAI API key is configured
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error("Error: OPENAI_API_KEY environment variable is not set");
  console.error(
    "Please make sure you have set the OPENAI_API_KEY in your .env file",
  );
  process.exit(1);
}

// Check for Qdrant configuration
const qdrantApiKey = process.env.QDRANT_API_KEY;
const qdrantUrl = process.env.QDRANT_CLOUD_URL;

if (qdrantApiKey && qdrantUrl) {
  console.log(
    "Qdrant configuration detected - will use Qdrant Cloud for vector storage",
  );
} else {
  console.log(
    "Qdrant configuration not detected - will use in-memory vector storage",
  );
}

console.log("Starting advanced vector search test...");
console.log("OpenAI API Key: Configured");

void testAdvancedSearch()
  .then(() => {
    console.log("Advanced test completed successfully");
  })
  .catch((error) => {
    console.error("Advanced test failed with error:", error);
    process.exit(1);
  });

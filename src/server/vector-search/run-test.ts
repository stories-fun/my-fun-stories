import { testVectorSearch } from "./test";

// Check if OpenAI API key is configured
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error("Error: OPENAI_API_KEY environment variable is not set");
  console.error(
    "Please make sure you have set the OPENAI_API_KEY in your .env file",
  );
  process.exit(1);
}

console.log("Starting vector search test...");
console.log("OpenAI API Key: Configured");

void testVectorSearch()
  .then(() => {
    console.log("Test completed");
  })
  .catch((error) => {
    console.error("Test failed with error:", error);
    process.exit(1);
  });

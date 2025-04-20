import { VectorSearchService } from "./vectorSearch";
import type { StoryVector } from "./types";
import { VECTOR_SEARCH_CONFIG } from "./config";

// Test class for testing vector search with complex search queries
class AdvancedTestVectorSearchService extends VectorSearchService {
  async generateEmbeddingForTest(text: string) {
    return this.openai.generateEmbedding(text);
  }

  getStoredVectors() {
    return this.getVectorsForTest();
  }
}

export async function testAdvancedSearch() {
  console.log("Starting advanced vector search test...");
  const vectorSearch = new AdvancedTestVectorSearchService();

  console.log(
    `Using ${VECTOR_SEARCH_CONFIG.useQdrant ? "Qdrant" : "in-memory"} storage for vector search`,
  );

  // Sample stories with different types of characters for testing different search intents
  const stories: StoryVector[] = [
    {
      id: "1",
      embedding: [], // This will be filled by OpenAI
      metadata: {
        title: "The Quantum Archaeologist",
        content: `In the year 2157, Dr. Sarah Chen stood at the precipice of a discovery that would reshape humanity's understanding of both history and physics. As a quantum archaeologist, she had spent the last decade developing technology that could observe quantum echoes of past events - essentially allowing her to witness history through the quantum remnants left behind in space-time.

Her laboratory, nestled deep within the Himalayan Mountains, housed the world's most advanced quantum resonance chamber. The chamber, a marvel of engineering that combined principles of quantum entanglement and temporal mechanics, could detect and amplify the faintest traces of quantum information that had been imprinted on the fabric of reality by past events.

Sarah was 35, single, and had dedicated her life to her work. She had a PhD in quantum physics from MIT and had published numerous papers on theoretical time observation. Her colleagues described her as brilliant, determined, and sometimes obsessively focused. In her rare free time, she enjoyed hiking the mountain trails and reading classic science fiction.`,
        username: "quantum_scribe",
        createdAt: new Date(),
        walletAddress: "0x123",
      },
    },
    {
      id: "2",
      embedding: [], // This will be filled by OpenAI
      metadata: {
        title: "The Product Manager's Journey",
        content: `Alex Rodriguez, 32, was the senior product manager at TechNova, a leading Silicon Valley startup. With an MBA from Stanford and five years of experience at Google, Alex had built a reputation for turning innovative ideas into successful products. 

He led a team of 15 people - designers, developers, and marketers - all working together to build the next generation of cloud-based productivity tools. His management style was collaborative but decisive; he valued input from his team but wasn't afraid to make the final call when necessary.

Alex was in a long-term relationship with Jamie, a UX designer at a different company. They lived together in San Francisco with their golden retriever, Pixel. When not working, Alex enjoyed rock climbing, attending tech conferences, and mentoring young professionals looking to break into product management.

His current project was particularly challenging - creating a platform that would use machine learning to automate routine business processes without eliminating the human touch that clients valued. The board wanted results by Q4, and competition was fierce.`,
        username: "pm_stories",
        createdAt: new Date(),
        walletAddress: "0x456",
      },
    },
    {
      id: "3",
      embedding: [], // This will be filled by OpenAI
      metadata: {
        title: "Finding Love in Paris",
        content: `Emma Wilson, 28, sipped her café au lait at a small bistro near the Seine, watching the early morning light play on the water. She had moved to Paris six months ago after ending a long relationship that had been going nowhere. As a freelance photographer specializing in architecture, Paris was the perfect city for both her heart and her career.

Emma was outgoing, creative, and had a laugh that could light up a room. She stood 5'6" with curly brown hair and green eyes that her friends said were her best feature. Though confident in her professional life, she was surprisingly shy when it came to dating.

Today she had planned a photoshoot at the Louvre, but her mind kept drifting to the handsome bookstore owner she had met last week. They had briefly talked about French literature and photography, and he had invited her to a gallery opening tomorrow night.

Emma was looking for someone who shared her passion for art and travel, someone kind with a good sense of humor who could be both a lover and a best friend. After her last relationship with a workaholic banker who had no time for her, she had promised herself she wouldn't settle for less than a deep, meaningful connection.`,
        username: "romantic_wanderer",
        createdAt: new Date(),
        walletAddress: "0x789",
      },
    },
  ];

  try {
    // Generate embeddings for stories
    console.log("Generating embeddings for stories...");
    for (const story of stories) {
      const textToEmbed = `${story.metadata.title ?? ""} ${story.metadata.content}`;
      const embedding =
        await vectorSearch.generateEmbeddingForTest(textToEmbed);
      story.embedding = embedding.embedding;
      console.log(`Generated embedding for story "${story.metadata.title}"`);
    }

    // Add stories to the search service
    await vectorSearch.addStories(stories);
    console.log("\nStories added to vector search service");

    // Test advanced search queries
    const testQueries = [
      // Dating-oriented queries
      "I'm looking for a romantic partner who is artistic and loves to travel",
      "Single woman in her twenties who enjoys art and culture",
      "Looking for someone adventurous with a good sense of humor for a potential relationship",

      // Professional-oriented queries
      "Need to find a product manager with experience in Silicon Valley tech companies",
      "Looking for someone with leadership skills who has managed teams in software development",
      "Need someone with MBA who understands machine learning and business processes",

      // General interest queries
      "Stories about scientists making major discoveries",
      "People who work in quantum physics and high-tech research",
      "Characters who are dedicated to their work and highly educated",
    ];

    // Run search tests with timing
    console.log("\n--- Testing advanced search queries ---");
    for (const query of testQueries) {
      const startTime = Date.now();
      console.log(`\nSearching for: "${query}"`);

      const searchResults = await vectorSearch.search(query);
      const endTime = Date.now();

      console.log(
        `Found ${searchResults.length} results in ${endTime - startTime}ms:`,
      );
      console.log(
        searchResults.map((r) => ({
          title: r.metadata.title,
          score: r.score.toFixed(4),
          extracted: r.metadata.extractedMetadata
            ? Object.keys(r.metadata.extractedMetadata).length
            : 0,
        })),
      );
    }

    // Test clear
    await vectorSearch.clear();
    console.log("\nTest completed successfully");
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
}

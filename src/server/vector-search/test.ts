import { VectorSearchService } from "./vectorSearch";
import type { StoryVector } from "./types";
import { VECTOR_SEARCH_CONFIG } from "./config";

// Create a test-specific subclass to access protected members
class TestVectorSearchService extends VectorSearchService {
  async generateEmbeddingForTest(text: string) {
    return this.openai.generateEmbedding(text);
  }

  // Helper method to inspect embeddings
  getStoredVectors() {
    return this.getVectorsForTest();
  }
}

export async function testVectorSearch() {
  const vectorSearch = new TestVectorSearchService();

  // Log which storage backend is being used
  console.log(
    `Using ${VECTOR_SEARCH_CONFIG.useQdrant ? "Qdrant" : "in-memory"} storage for vector search`,
  );

  // Sample stories with a longer narrative
  const stories: StoryVector[] = [
    {
      id: "1",
      embedding: [], // This will be filled by OpenAI
      metadata: {
        title: "The Quantum Archaeologist",
        content: `In the year 2157, Dr. Sarah Chen stood at the precipice of a discovery that would reshape humanity's understanding of both history and physics. As a quantum archaeologist, she had spent the last decade developing technology that could observe quantum echoes of past events - essentially allowing her to witness history through the quantum remnants left behind in space-time.

Her laboratory, nestled deep within the Himalayan Mountains, housed the world's most advanced quantum resonance chamber. The chamber, a marvel of engineering that combined principles of quantum entanglement and temporal mechanics, could detect and amplify the faintest traces of quantum information that had been imprinted on the fabric of reality by past events.

Today's experiment focused on an ancient civilization that had supposedly achieved technological advancement far beyond what conventional history suggested was possible. Archaeological sites across the globe had yielded fragments of inexplicable technology - components that seemed to defy the normal progression of human innovation.

As Sarah initiated the quantum scanning sequence, the chamber's crystalline walls began to pulse with an ethereal blue light. Holographic displays materialized around her, showing streams of quantum data being processed in real-time. The air itself seemed to thicken with potential as the machine reached deeper into the quantum fabric of space-time.

Suddenly, the displays erupted with activity. The quantum signatures were stronger than anything she had ever encountered. As the data coalesced into visible form, Sarah gasped. Before her stood a holographic recreation of an ancient laboratory, but one that looked more advanced than her own state-of-the-art facility.

The ancient scientists wore clothing that seemed to shift and adapt to their movements, and they manipulated what appeared to be three-dimensional holographic interfaces with casual expertise. But what caught Sarah's attention was the central device in their laboratory - a massive spherical structure that pulsed with a familiar blue light.

With growing excitement and trepidation, Sarah realized she was looking at an ancient version of her own quantum resonance chamber. The implications were staggering. These weren't just advanced ancestors; they were quantum archaeologists like herself, reaching across time to study civilizations even more ancient than their own.

As she delved deeper into the quantum data, she discovered something that made her blood run cold. The ancient scientists were desperately trying to prevent a catastrophe - a cascade failure in the quantum fabric of reality itself. Their records spoke of a mysterious dark energy that had begun to unravel the very structure of space-time.

Sarah's hands trembled as she cross-referenced their data with her own readings. The patterns matched. The same dark energy they had detected was present in her time, growing stronger by the day. She wasn't just observing history; she was witnessing a warning sent across millennia.

The ancient scientists had found a solution, but their records ended abruptly. The final entry in their quantum database spoke of a last-ditch effort to seal the breach in reality, but the cost would be the erasure of their entire civilization from conventional history - a quantum reset that would leave only the faintest traces of their existence.

Sarah now faced a monumental decision. The dark energy was returning, and she held the knowledge of both her own research and that of her ancient predecessors. The question wasn't just about saving humanity; it was about preserving the very fabric of reality itself. As she stared at the quantum echoes of the past, Sarah Chen realized that she wasn't just an observer of history - she was about to become its guardian.`,
        username: "quantum_scribe",
        createdAt: new Date(),
        walletAddress: "0x123",
      },
    },
  ];

  // Add additional test story if desired
  if (process.env.ADD_TEST_STORY === "true") {
    stories.push({
      id: "2",
      embedding: [], // This will be filled by OpenAI
      metadata: {
        title: "The Desert Navigator",
        content: `In the vast expanse of the Sahara Desert, Amina Khalid adjusted her solar-powered navigation system as the winds began to pick up. As a desert navigator, she guided researchers and explorers through the most dangerous territories of North Africa, using both ancient Bedouin knowledge passed down through generations and cutting-edge technology she had developed herself.

Today's expedition was particularly important. She was leading a team of climate scientists to a previously undiscovered oasis that had appeared in satellite imagery, possibly revealing new data about underground water systems and climate adaptation. The journey had already taken three days, and supplies were running low.

Amina's expertise wasn't merely geographical - her understanding of the desert's subtle signs and language was almost supernatural. Where others saw only endless waves of sand, she recognized distinct features, patterns, and warnings written in the landscape itself.

As the sandstorm intensified, she made a split-second decision to divert the expedition to a small depression between dunes. Using a device of her own invention - a ground-penetrating radar combined with traditional dowsing techniques - she identified a pocket of breathable air and relative stability where they could wait out the storm.

Inside their temporary shelter, as the team set up equipment to continue their research even while grounded, one of the younger scientists asked how she had known this place would be safe. Amina smiled and explained how her grandmother had taught her to listen to the desert's whispers, and how she had integrated that intuitive knowledge with modern sensing technology.

"The future of navigation isn't about abandoning traditional wisdom for technology," she told them. "It's about finding the harmony between them. The desert knows things our instruments cannot detect, but our instruments can verify what the desert tells us."

When the storm finally subsided the next morning, they emerged to find the landscape transformed. What had been featureless terrain now revealed a series of ancient stone markers, previously buried for centuries, pointing the way to the very oasis they sought.

The scientists were amazed, but Amina wasn't surprised. She had always believed that the desert didn't just hide its secrets - it revealed them to those who knew how to listen and look with both the wisdom of the past and the knowledge of the present.

As they approached the oasis, their instruments began registering something extraordinary - not just water, but a unique ecosystem that had evolved in isolation for thousands of years. Amina's combination of traditional navigation and modern science had led them to what would become one of the most important climate adaptation discoveries of the decade.

That evening, as the scientists excitedly cataloged their findings, Amina sat alone on a dune, watching the stars. She thought about how her grandmother would have been proud to see ancient wisdom validated by science, and how her own children would someday blend even more advanced technology with the timeless knowledge she would pass down to them.

In the distance, the desert winds began to shift again, whispering new secrets. Amina listened carefully, already planning tomorrow's journey.`,
        username: "desert_wanderer",
        createdAt: new Date(),
        walletAddress: "0x456",
      },
    });
  }

  try {
    // Start time measurement
    const startTime = Date.now();

    // Generate embeddings for stories
    console.log("Generating embeddings for stories...");
    for (const story of stories) {
      const textToEmbed = `${story.metadata.title ?? ""} ${story.metadata.content}`;
      const embedding =
        await vectorSearch.generateEmbeddingForTest(textToEmbed);
      story.embedding = embedding.embedding;
      console.log(`Generated embedding for story "${story.metadata.title}":`, {
        embeddingLength: embedding.embedding.length,
        usage: embedding.usage,
      });
    }

    // Add stories to the search service
    await vectorSearch.addStories(stories);
    console.log("\nStories added to vector search service");

    // Get the stored vectors to inspect the embeddings
    const storedVectors = vectorSearch.getStoredVectors();
    console.log("\nStored vectors:", {
      count: storedVectors.length,
      vectorDimensions: storedVectors.map((v) => v.embedding.length),
    });

    // Test searches with different queries
    const searchQueries = [
      "quantum physics and archaeology",
      "ancient civilizations and technology",
      "dark energy and space-time",
      "mysterious caves and treasures",
    ];

    // Run multiple search tests to test caching as well
    const runSearchTests = async (iteration: number) => {
      console.log(`\n--- Search test iteration #${iteration} ---`);

      for (const query of searchQueries) {
        const queryStartTime = Date.now();
        console.log(`\nSearching for: "${query}"`);
        const searchResults = await vectorSearch.search(query);
        const queryEndTime = Date.now();

        console.log(
          `Results (${queryEndTime - queryStartTime}ms):`,
          searchResults.map((r) => ({
            title: r.metadata.title,
            score: r.score.toFixed(4),
          })),
        );
      }
    };

    // Run search tests twice to demonstrate caching
    await runSearchTests(1);
    await runSearchTests(2);

    // Test vector count
    console.log("\nTotal vectors:", vectorSearch.getVectorCount());

    // Test removal
    await vectorSearch.removeStory("1");
    console.log("Vectors after removal:", vectorSearch.getVectorCount());

    // Test clear
    await vectorSearch.clear();
    console.log("Vectors after clear:", vectorSearch.getVectorCount());

    // End time measurement
    const endTime = Date.now();
    console.log(`\nTest completed in ${endTime - startTime}ms`);
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
}

// Run the test
void testVectorSearch();

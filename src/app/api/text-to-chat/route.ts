import { NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "~/env";
import {
  createConversation,
  addMessageToConversation,
} from "~/server/api/r2/voice";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const systemPrompt = `
You are the AI storyteller for Stories.fun — a platform where people transform their authentic life journeys into powerful, emotionally resonant stories that can be discovered, shared, and supported by others.

Your role is two fold:
1. Guide users through a deep, empathetic conversation to extract meaningful details from their lives.
2. Transform that information into powerful narratives in two formats — a short story card and a long-form immersive piece.

🌍 Why Storytelling Matters (Set the Context Early)
Remind users: storytelling is how humans make sense of life. Stories are up to 22 times more memorable than facts. Great stories influence how we’re seen, trusted, and remembered — whether in dating, fundraising, interviews, or relationships.

Let them know: Real people have launched careers, built communities, and even raised millions in crypto — all by telling their story well. This is a one-time effort that will reward them for life. The more they share, the more powerful the final story will be.

🎙️ Part 1: Active Listening & Information Extraction
Tone: Warm, curious, emotionally intelligent. Avoid corporate or robotic speech. Subtle playfulness is welcome.

Ask:
- Open-ended questions to reveal core truths, values, and transformations
- Emotionally rich or unique details (e.g., a parent's job, spiritual beliefs, obsessions)
- Whether users have any photos, screenshots, or emails they'd like to include

Track narrative arcs (conflict → turning point → resolution) and encourage honesty and vulnerability.

Types of Info to Extract:
- Childhood & background
- Identity (place of origin, beliefs, passions)
- Pivotal moments & lessons
- Emotional highlights (grief, hope, betrayal, joy)
- Professional & creative milestones

✍️ Part 2: Story Creation
Once enough has been shared, generate:

🧩 SHORT STORY (for Story Card)
- Headline: 10–14 words, emotionally loaded and truth-rooted
- Teaser (130–160 characters): hint at conflict, emotion, transformation
- Visual Suggestion: A real-life image the user could upload

📖 LONG STORY (Immersive Reading)
- ~600–650 words
- First- or second-person tone
- Clear arc: Conflict → Turning Point → Reflection
- Details: vivid anecdotes, emotions, sensory cues, cultural background
- End on a thoughtful, poetic or reflective note

🪄 Deliverables
After drafting, allow the user to:
- Review and edit
- Add media
- Publish their short and long story formats

🔐 Boundaries
- Celebrate truth, no fabrication
- Avoid generic language
- No investment or legal advice

🧭 Your Mission
Make people feel seen. Guide them gently. Craft stories that make strangers care.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userInput, userId, conversationId, generateStory = false } = body;

    if (!userInput || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const conversation = await createConversation(userId);
      currentConversationId = conversation.id;
    }

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput },
    ];

    if (generateStory) {
      messages.push({
        role: "system",
        content: `
Please now create two final outputs based on the conversation so far:

1. SHORT STORY CARD:
- Headline (10–14 words, emotionally strong)
- Teaser (130–160 characters)
- Visual suggestion (optional but helpful)

2. LONG STORY:
- 600–650 words
- Structure: Conflict → Turning Point → Reflection
- Include vivid, emotionally rich, sensory and cultural details
- End reflectively or poetically

Do NOT fabricate anything. Keep it grounded and authentic.
`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.8,
    });

    const aiResponse = completion.choices[0]?.message?.content ?? "";
    if (!aiResponse) throw new Error("No AI response received");

    await addMessageToConversation(
      userId,
      currentConversationId,
      userInput,
      aiResponse,
    );

    return NextResponse.json({
      aiResponse,
      conversationId: currentConversationId,
    });
  } catch (error) {
    console.error("Error processing text chat:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 },
    );
  }
}

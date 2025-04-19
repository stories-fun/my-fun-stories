import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { ChatOpenAI } from "@langchain/openai";
import { GraphCypherQAChain } from "@langchain/community/chains/graph_qa/cypher";
import { PromptTemplate } from "@langchain/core/prompts";

const CYPHER_GENERATION_TEMPLATE = `
You are a Neo4j Cypher expert. Convert this question into a valid Cypher query:
- Use ONLY nodes/relationships from this schema:
{schema}
- ALWAYS include a RETURN clause
- Return specific properties (e.g.: User.name, Story.title)
- Never return entire nodes (no RETURN u, s)

Question: {question}
Cypher Query:`;

export const getChain = async (): Promise<GraphCypherQAChain> => {
  console.log("here is getchain okay");

  const neo4jUri = process.env.NEO4J_URI;
  const neo4jUser = process.env.NEO4J_USER;
  const neo4jPassword = process.env.NEO4J_PASSWORD;

  if (!neo4jUri || !neo4jUser || !neo4jPassword) {
    throw new Error("Missing Neo4j credentials in environment variables");
  }
  const graph = await Neo4jGraph.initialize({
    url: neo4jUri,
    username: neo4jUser,
    password: neo4jPassword,
    database: "neo4j",
  });
  console.log("Graph schema:", graph.getSchema());

  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o",
  });

  return GraphCypherQAChain.fromLLM({
    llm,
    graph,
    returnDirect: false,
    cypherPrompt: PromptTemplate.fromTemplate(CYPHER_GENERATION_TEMPLATE),
  });
};

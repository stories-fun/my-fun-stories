"use client";

import { useState } from "react";
import {
  Search,
  Tag,
  Briefcase,
  MapPin,
  User,
  Clock,
  Calendar,
} from "lucide-react";

interface ExtractedMetadata {
  profession?: string;
  interests?: string[];
  age?: number;
  gender?: string;
  experiences?: string[];
  personalityTraits?: string[];
  skills?: string[];
  location?: string;
}

interface StoryMetadata {
  title: string;
  content: string;
  username: string;
  createdAt: string;
  walletAddress: string;
  extractedMetadata?: ExtractedMetadata;
}

interface SearchResult {
  id: string;
  score: number;
  metadata: StoryMetadata;
}

interface SearchResponse {
  error?: string;
  results?: SearchResult[];
}

export function StorySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stories/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = (await response.json()) as SearchResult[];
      setResults(data);

      // Add to search history if not already there
      if (!searchHistory.includes(query)) {
        setSearchHistory((prev) => [query, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to perform search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    // Submit the form programmatically
    const form = document.querySelector("form");
    form?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try searching for 'Product Managers' or 'Vipassana meditator in crypto'..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 rounded-md bg-blue-500 px-4 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {searchHistory.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Recent searches:</span>
          {searchHistory.map((historyItem) => (
            <button
              key={historyItem}
              onClick={() => handleHistoryClick(historyItem)}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
            >
              {historyItem}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="mb-2 flex items-start justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {result.metadata.title}
              </h2>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">
                {(result.score * 100).toFixed(1)}% match
              </span>
            </div>

            <p className="mb-4 line-clamp-3 text-gray-600">
              {result.metadata.content}
            </p>

            {result.metadata.extractedMetadata && (
              <div className="mb-4 flex flex-wrap gap-2">
                {result.metadata.extractedMetadata.profession && (
                  <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    <Briefcase className="mr-1 h-4 w-4" />
                    {result.metadata.extractedMetadata.profession}
                  </div>
                )}

                {result.metadata.extractedMetadata.location && (
                  <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    <MapPin className="mr-1 h-4 w-4" />
                    {result.metadata.extractedMetadata.location}
                  </div>
                )}

                {result.metadata.extractedMetadata.interests?.map(
                  (interest) => (
                    <div
                      key={interest}
                      className="flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                    >
                      <Tag className="mr-1 h-4 w-4" />
                      {interest}
                    </div>
                  ),
                )}

                {result.metadata.extractedMetadata.personalityTraits
                  ?.slice(0, 3)
                  .map((trait) => (
                    <div
                      key={trait}
                      className="flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
                    >
                      <User className="mr-1 h-4 w-4" />
                      {trait}
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-500">
              <span className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                {result.metadata.username}
              </span>
              <span className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {new Date(result.metadata.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {results.length === 0 && !isLoading && !error && (
          <p className="text-center text-gray-500">No results found</p>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

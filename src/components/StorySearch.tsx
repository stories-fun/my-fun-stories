"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";

interface SearchResultMetadata {
  profession?: string;
  interests?: string[];
  age?: number;
  gender?: string;
  experiences?: string[];
  personalityTraits?: string[];
  skills?: string[];
  location?: string;
  topics?: string[];
  summary?: string;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  username: string;
  score: number;
  createdAt: string;
  extractedMetadata?: SearchResultMetadata;
}

// Define the shape of search options
interface SearchOptions {
  intent: "general" | "professional" | "connection" | "dating";
  profession?: string;
  interests?: string[];
  gender?: string;
  location?: string;
  age?: {
    min?: number;
    max?: number;
  };
}

// Added type for API response
interface VectorSearchResponse {
  results: Array<{
    id: string;
    score: number;
    metadata: {
      title: string;
      content: string;
      username: string;
      createdAt: Date | string;
      walletAddress: string;
      extractedMetadata?: {
        topics?: string[];
        summary?: string;
        [key: string]: string[] | string | undefined;
      };
    };
  }>;
  totalVectors: number;
  resultsFound: number;
  scores: number[];
}

interface StorySearchProps {
  initialQuery?: string;
  autoExecute?: boolean;
}

export default function StorySearch({
  initialQuery = "",
  autoExecute = false,
}: StorySearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchIntent, setSearchIntent] = useState<
    "general" | "professional" | "connection" | "dating"
  >("general");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    profession: "",
    interests: "",
    minAge: "",
    maxAge: "",
    gender: "",
    location: "",
  });

  // Use a ref to track if we've already executed the initial search
  const initialSearchDone = useRef(false);

  const searchStories = api.vectorSearch.searchStories.useMutation({
    onMutate: () => {
      setIsSearching(true);
      setError(null);
    },
    onSuccess: (data: VectorSearchResponse) => {
      // The API returns an object with a results property
      if (data?.results) {
        // Map the complex data structure to the format expected by the component
        const formattedResults = data.results.map((result) => ({
          id: result.id,
          title: result.metadata.title,
          content: result.metadata.content,
          username: result.metadata.username,
          score: result.score,
          createdAt:
            typeof result.metadata.createdAt === "string"
              ? result.metadata.createdAt
              : result.metadata.createdAt.toISOString(),
          extractedMetadata: result.metadata.extractedMetadata,
        }));
        setResults(formattedResults);
        console.log(`Loaded ${formattedResults.length} results`);
      } else {
        setResults([]);
        console.log("No results returned from API");
      }
      setIsSearching(false);
    },
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      setError(err.message);
      setIsSearching(false);
      console.error("Search error:", err);
    },
  });

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    // Construct search options from filters
    const searchOptions: SearchOptions = {
      intent: searchIntent,
    };

    // Add filters if values are provided
    if (filters.profession) searchOptions.profession = filters.profession;
    if (filters.interests)
      searchOptions.interests = filters.interests
        .split(",")
        .map((i) => i.trim());
    if (filters.gender) searchOptions.gender = filters.gender;
    if (filters.location) searchOptions.location = filters.location;

    // Handle age range
    if (filters.minAge || filters.maxAge) {
      searchOptions.age = {};
      if (filters.minAge) searchOptions.age.min = parseInt(filters.minAge);
      if (filters.maxAge) searchOptions.age.max = parseInt(filters.maxAge);
    }

    // Execute search
    searchStories.mutate({ query, options: searchOptions });
  }, [query, filters, searchIntent, searchStories]);

  // Use the initialQuery to trigger a search if provided
  useEffect(() => {
    // Only run this once and only if we have an initial query and autoExecute is true
    if (
      !initialSearchDone.current &&
      initialQuery &&
      initialQuery.trim() !== "" &&
      autoExecute
    ) {
      initialSearchDone.current = true;

      // Execute search with the initial query directly
      const searchOptions: SearchOptions = { intent: searchIntent };
      searchStories.mutate({ query: initialQuery, options: searchOptions });
    }
  }, [initialQuery, searchIntent, searchStories, autoExecute]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  // Format the result content for display
  const formatContent = (content: string) => {
    return content.length > 250 ? `${content.substring(0, 250)}...` : content;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold">Story Search</h2>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex flex-col">
          <div className="mb-4 flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for stories..."
              className="w-full rounded-l-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && void handleSearch()}
            />
            <button
              onClick={() => void handleSearch()}
              disabled={isSearching || !query.trim()}
              className="rounded-r-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <select
                value={searchIntent}
                onChange={(e) =>
                  setSearchIntent(
                    e.target.value as
                      | "general"
                      | "professional"
                      | "connection"
                      | "dating",
                  )
                }
                className="rounded-md border border-gray-300 p-2"
              >
                <option value="general">General Search</option>
                <option value="professional">Professional</option>
                <option value="connection">Connection</option>
                <option value="dating">Dating</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-md bg-gray-50 p-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="profession"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Profession
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={filters.profession}
                onChange={handleFilterChange}
                placeholder="e.g. Doctor, Engineer"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label
                htmlFor="interests"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Interests (comma-separated)
              </label>
              <input
                type="text"
                id="interests"
                name="interests"
                value={filters.interests}
                onChange={handleFilterChange}
                placeholder="e.g. travel, cooking, music"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g. New York, London"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="minAge"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Min Age
              </label>
              <input
                type="number"
                id="minAge"
                name="minAge"
                value={filters.minAge}
                onChange={handleFilterChange}
                min="0"
                max="120"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label
                htmlFor="maxAge"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Max Age
              </label>
              <input
                type="number"
                id="maxAge"
                name="maxAge"
                value={filters.maxAge}
                onChange={handleFilterChange}
                min="0"
                max="120"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">
            Search Results ({results.length})
          </h3>

          {results.map((result) => (
            <div
              key={result.id}
              className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xl font-bold text-blue-600">
                  {result.title}
                </h4>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                  {Math.round(result.score * 100)}% match
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                By {result.username} • {formatDate(result.createdAt)}
              </p>

              <p className="mt-3 text-gray-700">
                {formatContent(result.content)}
              </p>

              {result.extractedMetadata && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="mb-2 text-sm font-semibold">Story Metadata:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.extractedMetadata.profession && (
                      <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
                        {result.extractedMetadata.profession}
                      </span>
                    )}

                    {result.extractedMetadata.location && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        {result.extractedMetadata.location}
                      </span>
                    )}

                    {result.extractedMetadata.interests?.map((interest, i) => (
                      <span
                        key={i}
                        className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
                      >
                        {interest}
                      </span>
                    ))}

                    {result.extractedMetadata.topics
                      ?.slice(0, 3)
                      .map((topic, i) => (
                        <span
                          key={i}
                          className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                        >
                          {topic}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : query && !isSearching ? (
        <div className="py-10 text-center text-gray-500">
          No stories found for your search. Try different keywords or filters.
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";
import Link from "next/link";
import NavBar from "~/app/_components/NavBar";
import { FiSearch, FiX, FiArrowRight } from "react-icons/fi";

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
  const [showMoreResults, setShowMoreResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Search suggestions
  const searchSuggestions = [
    "Adventure stories in Europe",
    "Romantic stories with happy endings",
    "Mystery stories with unexpected twists"
  ];

  // Remove searchIntent and showFilters states
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

  // Update query whenever initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const searchStories = api.vectorSearch.searchStories.useMutation({
    onMutate: () => {
      setIsSearching(true);
      setError(null);
      setShowMoreResults(false); // Reset show more state on new search
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

    // Always use general intent as we've removed the dropdown
    const searchOptions: SearchOptions = {
      intent: "general",
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
    
    // Focus back on the search input after searching
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [query, filters, searchStories]);

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
      const searchOptions: SearchOptions = { intent: "general" };
      searchStories.mutate({ query: initialQuery, options: searchOptions });
    }
  }, [initialQuery, searchStories, autoExecute]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      void handleSearch();
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    
    // Create search options
    const searchOptions: SearchOptions = { intent: "general" };
    
    // Execute search with the suggestion
    searchStories.mutate({ query: suggestion, options: searchOptions });
  };

  // Format the result content for display
  const formatContent = (content: string) => {
    return content.length > 250 ? `${content.substring(0, 250)}...` : content;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get top results and remaining results
  const topResults = results.slice(0, 3); // Show only top 3 most relevant results first
  const remainingResults = results.slice(3); // All other results

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Search results content goes here */}

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

            {/* Top results section */}
            <div className="space-y-6">
              {topResults.map((result) => (
                <Link
                  href={`/stories/${result.id}`}
                  key={result.id}
                  className="block"
                >
                  <div className="rounded-lg border-l-4 border-l-blue-500 bg-white p-6 shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg">
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
                        <p className="mb-2 text-sm font-semibold">
                          Story Metadata:
                        </p>
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

                          {result.extractedMetadata.interests?.map(
                            (interest, i) => (
                              <span
                                key={i}
                                className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
                              >
                                {interest}
                              </span>
                            ),
                          )}

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
                </Link>
              ))}
            </div>

            {/* Show More Results button */}
            {remainingResults.length > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowMoreResults(!showMoreResults)}
                  className="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 shadow-sm"
                >
                  {showMoreResults
                    ? "Show Less"
                    : `Show ${remainingResults.length} More Results`}
                </button>
              </div>
            )}

            {/* Additional results section */}
            {showMoreResults && remainingResults.length > 0 && (
              <div className="mt-8 space-y-6 mb-16">
                <h4 className="text-lg font-medium text-blue-600 border-b border-blue-200 pb-2">
                  More Related Stories
                </h4>
                <div className="grid gap-6 md:grid-cols-2">
                  {remainingResults.map((result) => (
                    <Link
                      href={`/stories/${result.id}`}
                      key={result.id}
                      className="block"
                    >
                      <div className="rounded-lg bg-white p-4 shadow-sm transition-all duration-200 hover:translate-y-[-2px] hover:shadow">
                        <div className="flex items-start justify-between">
                          <h4 className="text-lg font-bold text-gray-800">
                            {result.title}
                          </h4>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {Math.round(result.score * 100)}% match
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          By {result.username} • {formatDate(result.createdAt)}
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                          {formatContent(result.content.substring(0, 150))}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : query && !isSearching ? (
          <div className="py-10 text-center text-gray-500">
            No stories found for your search. Try different keywords.
          </div>
        ) : null}
      </div>
      
      {/* ChatGPT-style bottom search panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg">
        {/* Scroll to top button when results are available */}
        {results.length > 0 && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="rounded-full bg-white p-2 shadow-md hover:shadow-lg focus:outline-none"
              aria-label="Scroll to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        )}
        <div className="mx-auto max-w-4xl">
          {/* Search suggestions */}
          {!query.trim() && results.length === 0 && !isSearching && (
            <div className="mb-4 space-y-2">
              <p className="text-sm font-medium text-gray-500">Try searching for:</p>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search input with integrated button */}
          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex flex-1 items-center px-4">
              <FiSearch className="mr-2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search stories..."
                className="w-full bg-transparent py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="ml-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Integrated search button */}
            {query.trim() && (
              <button
                onClick={() => void handleSearch()}
                disabled={isSearching}
                className="flex h-full items-center justify-center bg-blue-500 px-4 text-white hover:bg-blue-600 disabled:bg-blue-300"
                aria-label="Search"
              >
                {isSearching ? (
                  <span className="px-2 text-sm">Searching...</span>
                ) : (
                  <FiArrowRight className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

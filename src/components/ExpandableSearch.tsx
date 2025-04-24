"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiArrowRight } from "react-icons/fi";

export default function ExpandableSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Search suggestions
  const searchSuggestions = [
    "I want to connect with some isha meditators in crypto space",
    "Tell me some romantic stories with sad endings",
    "I want to learn programming and then build great products having exciting and useful UI/UX. Suggest me similar stories.",
  ];

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isExpanded]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  // Close when clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isExpanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&autoExecute=true`,
      );
      setIsExpanded(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}&autoExecute=true`);
    setIsExpanded(false);
  };

  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* ChatGPT-style search button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="mx-auto flex w-full max-w-3xl items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-2 text-sm text-gray-500 shadow-sm hover:border-gray-300 hover:shadow"
          aria-label="Search"
        >
          <span className="flex items-center gap-2">
            <FiSearch className="h-4 w-4" />
            Search stories...
          </span>
        </button>
      )}

      {/* ChatGPT-style bottom search panel */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all duration-200">
          <div
            className="animate-slideUp w-full max-w-3xl px-4 pb-4"
            ref={searchContainerRef}
          >
            <div className="relative rounded-2xl bg-white p-4 shadow-lg">
              {/* Search suggestions */}
              {!searchQuery.trim() && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Try searching for:
                  </p>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search stories..."
                    className="w-full bg-transparent py-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Integrated search button */}
                {searchQuery.trim() && (
                  <button
                    onClick={handleSearch}
                    className="flex h-full items-center justify-center bg-blue-500 px-4 text-white hover:bg-blue-600"
                    aria-label="Search"
                  >
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

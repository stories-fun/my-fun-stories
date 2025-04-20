"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";

export default function ExpandableSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&autoExecute=true`,
      );
      setIsExpanded(false);
    }
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
          <div className="animate-slideUp w-full max-w-3xl px-4 pb-4">
            <div className="relative rounded-2xl bg-white p-2 shadow-lg">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white px-4">
                <FiSearch className="mr-2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything"
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

              <div className="mt-2 flex items-center justify-between px-1">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="rounded-md px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                  className="rounded-md bg-blue-500 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

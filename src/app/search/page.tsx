"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import StorySearch from "~/components/StorySearch";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [initialQuery, setInitialQuery] = useState("");
  const [autoExecute, setAutoExecute] = useState(false);

  useEffect(() => {
    // Get query and autoExecute from URL parameters
    if (searchParams) {
      const query = searchParams.get("q");
      const shouldAutoExecute = searchParams.get("autoExecute") === "true";

      if (query) {
        setInitialQuery(query);
        setAutoExecute(shouldAutoExecute);
      }
    }
  }, [searchParams]);

  return <StorySearch initialQuery={initialQuery} autoExecute={autoExecute} />;
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={<div className="p-4 text-center">Loading search...</div>}
      >
        <SearchPageContent />
      </Suspense>
    </main>
  );
}

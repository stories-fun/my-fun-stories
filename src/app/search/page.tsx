"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import StorySearch from "~/components/StorySearch";

export default function SearchPage() {
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

  return (
    <main className="min-h-screen bg-gray-50">
      <StorySearch initialQuery={initialQuery} autoExecute={autoExecute} />
    </main>
  );
}

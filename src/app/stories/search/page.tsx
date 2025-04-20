import { Suspense } from "react";
import { StorySearch } from "./StorySearch";

export default function StorySearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Story Search</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <StorySearch />
      </Suspense>
    </div>
  );
}

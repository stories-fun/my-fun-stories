import { Suspense } from "react";
import NavBar from "~/app/_components/NavBar";
import StorySearch from "~/components/StorySearch";

export default function StorySearchPage() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <StorySearch />
        </Suspense>
      </div>
    </>
  );
}

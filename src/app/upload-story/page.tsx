"use client";

import { CreateStory } from "~/app/_components/CreateStory";
import { StoryList } from "~/app/_components/StoryList";
import Link from "next/link";

export default function UploadStoryPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Share Your Story</h1>
        <CreateStory />
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Stories</h2>
          <Link 
            href="/stories" 
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            View all
          </Link>
        </div>
        <StoryList />
      </div>
    </div>
  );
} 
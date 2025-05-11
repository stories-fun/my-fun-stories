"use client";

import { CreateStory } from "~/app/_components/CreateStory";

export default function UploadStoryPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Share Your Story</h1>
        <CreateStory />
      </div>
    </div>
  );
} 
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiShare2,
  FiBookmark,
  FiHeart,
  FiMessageSquare,
} from "react-icons/fi";
import { api } from "~/trpc/react";

// Placeholder image URLs
const PLACEHOLDER_IMAGES = [
  "https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/1.jpg",
  "https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/2.webp",
  "https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/3.jpeg",
];

// Interface for the story data
interface StoryData {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  imageUrl: string;
  readTime: string;
  tags: string[];
}

// Simplified placeholder component while we're implementing the API
export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params?.id as string;
  const [story, setStory] = useState<StoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [similarStories, setSimilarStories] = useState<StoryData[]>([]);

  // Use useEffect to fetch the story data
  useEffect(() => {
    // Sample data for now - in a real implementation, fetch from API
    setTimeout(() => {
      const demoStory: StoryData = {
        id: storyId,
        title: "The Journey of a Lifetime: Discovering New Horizons",
        content: `Every journey begins with a single step, and mine was no different. It was the summer of 2018 when I decided to leave behind the comfort of my corporate job and embark on a path less traveled.\n\nThe decision wasn't easy. I had spent years building a career, establishing connections, and creating a life that was, by all conventional measures, successful. But something was missing. A void that no promotion, no raise, no external validation could fill.\n\nI remember the day clearly: sitting in my corner office, staring out at the city skyline, feeling more trapped than accomplished. The weight of routine had become unbearable, and the monotony of days blending into one another was suffocating my creativity and passion.\n\nSo I took the leap. Sold most of my possessions, packed a single backpack, and purchased a one-way ticket to a country I had never visited before. Friends thought I was having a midlife crisis. Family worried I was making a terrible mistake. But deep down, I knew this was the reset I desperately needed.\n\nThe first few months were challenging. Adapting to new cultures, navigating language barriers, and dealing with the uncertainty of not having a fixed schedule or destination. But with each new day came new discoveries – about the world, about human connections, and most importantly, about myself.\n\nI've now been traveling for over five years, visiting more than 40 countries, learning snippets of a dozen languages, and collecting stories and experiences that have fundamentally changed who I am. The journey hasn't always been smooth, but it has been authentic and transformative.\n\nLooking back, I don't regret leaving behind my old life. The experiences I've gained, the perspectives I've developed, and the personal growth I've achieved far outweigh any career advancement or material comfort I might have missed.\n\nIf there's one thing I've learned, it's that the most rewarding journeys are not the ones that take you to new places, but the ones that bring you back to yourself – with a deeper understanding, greater compassion, and a renewed sense of purpose.\n\nThis is my story, and it's still being written with each new horizon I chase.`,
        username: "Adventurer",
        createdAt: new Date().toLocaleDateString(),
        imageUrl: PLACEHOLDER_IMAGES[1] ?? "", // Ensure imageUrl is never undefined
        readTime: "6 min read",
        tags: ["journey", "adventure", "self-discovery"],
      };

      setStory(demoStory);
      setIsLoading(false);
      // Generate some fake similar stories
      const fakeSimilarStories = Array(3)
        .fill(null)
        .map((_, index) => ({
          id: `similar-${index}`,
          title: `Related Story ${index + 1}: The Journey...`,
          content: demoStory.content.substring(0, 150) + "...",
          username: ["Alex", "Jamie", "Taylor"][index % 3] ?? "Anonymous",
          createdAt: new Date().toLocaleDateString(),
          imageUrl: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
          readTime: `${Math.ceil(Math.random() * 10)} min read`,
          tags: ["adventure", "journey"],
        }))
        .map((story) => ({
          ...story,
          imageUrl: story.imageUrl ?? "", // Ensure imageUrl is never undefined
        }));

      setSimilarStories(fakeSimilarStories);
    }, 1000); // Simulate network delay
  }, [storyId]);

  // Format the story content with proper paragraph breaks
  const formatContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => (
      <p key={index} className="mb-6 text-lg leading-relaxed text-gray-800">
        {paragraph}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Story Not Found
        </h1>
        <p className="mb-8 text-gray-600">
          The story you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/search"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-16">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/search"
              className="flex items-center text-gray-700 hover:text-blue-600"
            >
              <FiArrowLeft className="mr-2" />
              <span>Back to Search</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`rounded-full p-2 ${bookmarked ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <FiBookmark />
              </button>
              <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <article className="container mx-auto max-w-4xl px-4 py-8">
        {/* Story header */}
        <header className="mb-10">
          <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            {story.title}
          </h1>
          <div className="mb-6 flex items-center text-gray-600">
            <span className="mr-4">{story.readTime}</span>
            <span>•</span>
            <span className="ml-4">{story.createdAt}</span>
          </div>
          <div className="mb-8 flex flex-wrap gap-2">
            {story.tags?.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center">
            <div className="mr-3 h-12 w-12 overflow-hidden rounded-full bg-gray-300">
              {/* Author avatar placeholder */}
              <div className="flex h-full w-full items-center justify-center bg-blue-100 text-xl font-bold text-blue-500">
                {story.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{story.username}</p>
              <p className="text-sm text-gray-600">Author</p>
            </div>
          </div>
        </header>

        {/* Story featured image */}
        {story.imageUrl && (
          <div className="mb-10 overflow-hidden rounded-xl">
            <div className="relative h-[400px] w-full">
              <Image
                src={story.imageUrl}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </div>
          </div>
        )}

        {/* Story content */}
        <div className="prose prose-lg max-w-none">
          {formatContent(story.content)}
        </div>

        {/* Engagement bar */}
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center space-x-2 ${liked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
            >
              <FiHeart className={liked ? "fill-current" : ""} />
              <span>{liked ? "Liked" : "Like"}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
              <FiMessageSquare />
              <span>Comment</span>
            </button>
          </div>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex items-center space-x-2 ${bookmarked ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          >
            <FiBookmark className={bookmarked ? "fill-current" : ""} />
            <span>{bookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>
      </article>

      {/* Similar stories section */}
      <section className="container mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          More Stories Like This
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {similarStories.map((similarStory) => (
            <div
              key={similarStory.id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:translate-y-[-4px]"
            >
              {similarStory.imageUrl && (
                <div className="relative h-40 w-full">
                  <Image
                    src={similarStory.imageUrl}
                    alt={similarStory.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="mb-2 font-bold text-gray-900">
                  {similarStory.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600">
                  {similarStory.content.length > 100
                    ? `${similarStory.content.substring(0, 100)}...`
                    : similarStory.content}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{similarStory.readTime}</span>
                  <span className="font-medium text-blue-600">Read more</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

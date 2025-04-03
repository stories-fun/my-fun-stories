"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import PostActions from "~/app/_components/PostActions";
import ProgressBar from "~/app/_components/ProgressBar";
import { useStoriesStore } from "~/store/useStoriesStore";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { ImageSlider } from "./ImageSlider";
import { useStoryVideoStore } from "~/store/useStoryVideoStore";

const LiveIndicator = ({ index }: { index: number }) => (
  <div className="flex items-center space-x-1">
    <div
      className={`h-1.5 w-1.5 rounded-full ${index === 1 ? "bg-green-500" : "bg-red-500"}`}
    ></div>
    <span className="text-xs">
      {index === 1 ? "Going Live on 20th March" : "Live Now"}
    </span>
  </div>
);

const StoryHeader = ({
  username,
  index,
}: {
  username: string;
  index: number;
}) => (
  <div className="mb-3 flex items-center space-x-2">
    <ProfileImage src="/images/profile.png" alt={`${username}'s profile`} />
    <div className="flex flex-col">
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{username}</span>
        <VerificationBadge />
      </div>
      <div className="flex items-center space-x-2">
        {index !== 1 && (
          <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs text-white">
            Trending
          </span>
        )}
        <LiveIndicator index={index} />
      </div>
    </div>
  </div>
);

const truncateContent = (content: string, wordLimit: number) => {
  const words = content.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return content;
};

const ProfileImage = ({ src, alt }: { src: string; alt: string }) => {
  const { isLoading, setIsLoading } = useStoryVideoStore();

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
      <Image
        src={src}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        priority={true}
        sizes="40px"
      />
    </div>
  );
};

const VerificationBadge = () => (
  <div className="relative h-4 w-4">
    <Image
      src="/images/verification.png"
      fill
      className="object-contain"
      alt="verified"
      priority={true}
      sizes="16px"
    />
  </div>
);

const StoriesCard = () => {
  const router = useRouter();
  const { stories, error, isLoading, getStories } = useStoriesStore();

  const hardcodedStory = {
    title:
      "Committed Visa Fraud. Had a Strange Awakening. Confessed to Immigration and then...",
    content:
      "My name is Ninh and I grew up in a modest household in Vietnam. I moved from Vietnam to realize my American Dream -at any cost & I did. I fraudulently Acquired my AmericanCitizenship with a fake marriage. One Day, I had a Strange Christ Experience and Confessed my Crimes to the Authorities...This is what happened next...\nThis Is My Story…",
  };

  useEffect(() => {
    void getStories();
  }, [getStories]);

  const handleCardClick = (id: string) => {
    router.push(`/stories/${id}`);
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-500">
        Error Loading Stories: {error}
      </div>
    );
  if (!stories?.length)
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-500">
        No stories found
      </div>
    );

  return (
    <div className="mx-auto w-full">
      {stories.map((story, index) => (
        <article
          key={story.id}
          className={`relative mb-4 overflow-hidden bg-white p-3 ${
            index >= 2 ? "opacity-50" : ""
          }`}
        >
          <StoryHeader username={story.username} index={index} />

          <div className="flex flex-col space-y-3 lg:flex-row lg:space-x-6 lg:space-y-0">
            <div className="w-full lg:w-1/3">
              <div
                className="relative aspect-video w-full cursor-pointer bg-gray-100"
                onClick={() => handleCardClick(story.id)}
              >
                {index === 0 ? (
                  <Image
                    src="https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/1.jpg"
                    alt="Story image"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                ) : index === 1 ? (
                  <Image
                    src="https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/2.webp"
                    alt="Story image"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageSlider />
                )}
              </div>
              <PostActions storyKey={story.id} />
              <div>
                <ProgressBar />
              </div>
            </div>

            <div
              className="w-full cursor-pointer pt-2 lg:w-2/3 lg:pt-0"
              onClick={() => handleCardClick(story.id)}
            >
              <div className="space-y-2">
                <h2 className="font-lg text-xl font-[IBM_Plex_Sans] leading-tight sm:text-2xl">
                  Wrote a Bestseller, TEDx went viral, Disappeared from the
                  public sphere Lived in a Monastery, Met God & Got Into Crypto
                </h2>
                <p className="text-base text-gray-600 sm:text-lg">
                  Nine years ago, I sold chai on the streets of Bengaluru,
                  launched a record-breaking Kickstarter campaign, wrote a book
                  that became a bestseller. Then, I disappeared from the face of
                  the earth for over 4 years. What happened in these years? I
                  met a mysterious man, somehow ended up in a monastery where I
                  spent years—questioning everything I thought I knew about
                  life. And then I Met God & Got Into Crypto…
                </p>
              </div>
            </div>
          </div>

          {index >= 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <span className="z-10 text-xl font-semibold text-black">
                Coming Soon
              </span>
            </div>
          )}
        </article>
      ))}
      <article className="relative mb-4 overflow-hidden bg-white p-3">
        <StoryHeader username={"Admin"} index={1} />

        <div className="flex flex-col space-y-3 lg:flex-row lg:space-x-6 lg:space-y-0">
          <div className="w-full lg:w-1/3">
            <div className="relative aspect-video w-full cursor-pointer bg-gray-100">
              <Image
                src="https://pub-61076b0159ee4fdab7efe9dadc68458d.r2.dev/assets/2.webp"
                alt="Story image"
                width={400}
                height={300}
                className="h-full w-full object-cover"
                onClick={() =>
                  alert("This story will be released on March 20th!")
                }
              />
            </div>
            <PostActions storyKey={"1740064537760_DHykt1"} />
            <div>
              <ProgressBar />
            </div>
          </div>

          <div
            className="w-full cursor-pointer pt-2 lg:w-2/3 lg:pt-0"
            onClick={() => alert("This story will be released on March 20th!")}
          >
            <div className="space-y-2">
              <h2 className="font-lg text-xl font-[IBM_Plex_Sans] leading-tight sm:text-2xl">
                {hardcodedStory.title}
              </h2>
              <p className="text-base text-gray-600 sm:text-lg">
                {truncateContent(hardcodedStory.content, 60)}
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className="relative mb-4 overflow-hidden bg-white p-3">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/95">
          <h2 className="text-2xl font-bold text-black sm:text-[32px]">
            Coming Soon
          </h2>
        </div>

        <StoryHeader username={"Admin"} index={1} />

        <div className="relative flex flex-col space-y-3 lg:flex-row lg:space-x-6 lg:space-y-0">
          <div className="w-full lg:w-1/3">
            <div className="relative aspect-video w-full cursor-pointer bg-gray-100">
              <ImageSlider />
            </div>
            <PostActions storyKey={"1740064537760_DHykt1"} />
            <div>
              <ProgressBar />
            </div>
          </div>

          <div
            className="w-full cursor-pointer pt-2 lg:w-2/3 lg:pt-0"
            onClick={() => alert("This story will be released on March 20th!")}
          >
            <div className="space-y-2">
              <h2 className="font-lg text-lg font-[IBM_Plex_Sans] leading-tight">
                {hardcodedStory.title}
              </h2>
              <p className="text-sm text-gray-600">
                {truncateContent(hardcodedStory.content, 80)}
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className="relative mb-4 overflow-hidden bg-white p-3">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/95">
          <h2 className="text-2xl font-bold text-black sm:text-[32px]">
            Coming Soon
          </h2>
        </div>

        <StoryHeader username={"Admin"} index={1} />

        <div className="relative flex flex-col space-y-3 lg:flex-row lg:space-x-6 lg:space-y-0">
          <div className="w-full lg:w-1/3">
            <div className="relative aspect-video w-full cursor-pointer bg-gray-100">
              <ImageSlider />
            </div>
            <PostActions storyKey={"1740064537760_DHykt1"} />
            <div>
              <ProgressBar />
            </div>
          </div>

          <div
            className="w-full cursor-pointer pt-2 lg:w-2/3 lg:pt-0"
            onClick={() => alert("This story will be released on March 20th!")}
          >
            <div className="space-y-2">
              <h2 className="font-lg text-lg font-[IBM_Plex_Sans] leading-tight">
                {hardcodedStory.title}
              </h2>
              <p className="text-sm text-gray-600">
                {truncateContent(hardcodedStory.content, 80)}
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className="relative mb-4 overflow-hidden bg-white p-3">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/95">
          <h2 className="text-2xl font-bold text-black sm:text-[32px]">
            Coming Soon
          </h2>
        </div>

        <StoryHeader username={"Admin"} index={1} />

        <div className="relative flex flex-col space-y-3 lg:flex-row lg:space-x-6 lg:space-y-0">
          <div className="w-full lg:w-1/3">
            <div className="relative aspect-video w-full cursor-pointer bg-gray-100">
              <ImageSlider />
            </div>
            <PostActions storyKey={"1740064537760_DHykt1"} />
            <div>
              <ProgressBar />
            </div>
          </div>

          <div
            className="w-full cursor-pointer pt-2 lg:w-2/3 lg:pt-0"
            onClick={() => alert("This story will be released on March 20th!")}
          >
            <div className="space-y-2">
              <h2 className="font-lg text-lg font-[IBM_Plex_Sans] leading-tight">
                {hardcodedStory.title}
              </h2>
              <p className="text-sm text-gray-600">
                {truncateContent(hardcodedStory.content, 80)}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default StoriesCard;

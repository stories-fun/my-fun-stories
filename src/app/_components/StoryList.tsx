import { api } from "~/trpc/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Link from "next/link";

export function StoryList() {
  const utils = api.useUtils();
  const { data: storiesData, isLoading } = api.story.list.useQuery({
    limit: 10
  });

  const { mutate: deleteStory } = api.story.delete.useMutation({
    onSuccess: () => {
      utils.story.list.invalidate();
    },
  });

  const handleDelete = (storyKey: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      deleteStory({
        storyKey,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="mt-2 h-3 w-1/2 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!storiesData?.stories.length) {
    return (
      <div className="text-center text-gray-500 py-4">
        No stories found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {storiesData.stories.map((story) => (
        <div key={story.key} className="block hover:bg-gray-50 p-4 rounded-lg transition-colors">
          <div className="flex justify-between items-start">
            <Link href={`/stories/${story.key}`} className="flex-1">
              <div>
                <h3 className="font-medium text-lg">
                  {story.title || "Untitled Story"}
                </h3>
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {story.content}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>By {story.username}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(story.createdAt))} ago</span>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <span>❤️</span> {story.likes.length}
                </span>
                <span className="flex items-center gap-1">
                  <span>💬</span> {story.comments.length}
                </span>
              </div>
              
                <button
                  onClick={() => handleDelete(story.key)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
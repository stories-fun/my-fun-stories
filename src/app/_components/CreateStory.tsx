import { useState } from 'react';
import { api } from "~/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useUserStore } from "~/store/useUserStore";
import { toast } from "react-hot-toast";

export function CreateStory() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [writerName, setWriterName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  
  const wallet = useWallet();
  const { username } = useUserStore();
  
  const createStory = api.story.create.useMutation({
    onSuccess: () => {
      setContent("");
      setTitle("");
      setWriterName("");
      setWalletAddress("");
      toast.success("Story created successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }

    if (!writerName.trim()) {
      toast.error("Please enter writer's name");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    createStory.mutate({
      content,
      title: title.trim() || undefined,
      walletAddress: walletAddress.trim(),
      writerName: writerName.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="walletAddress" className="block text-sm font-medium">
          Wallet Address
        </label>
        <input
          id="walletAddress"
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="Enter wallet address..."
          required
        />
      </div>

      <div>
        <label htmlFor="writerName" className="block text-sm font-medium">
          Writer's Name
        </label>
        <input
          id="writerName"
          type="text"
          value={writerName}
          onChange={(e) => setWriterName(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="Enter writer's name..."
          required
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title (optional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="Enter story title..."
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          rows={4}
          placeholder="Write your story..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={createStory.isPending}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {createStory.isPending ? "Creating..." : "Create Story"}
      </button>
    </form>
  );
} 
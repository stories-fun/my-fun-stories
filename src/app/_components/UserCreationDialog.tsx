import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { api } from "~/trpc/react";
import Image from "next/image";
import { Label } from "./ui/label";
import { toast } from "react-hot-toast";
import { useUserStore } from "~/store/useUserStore";

interface UserCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

interface UploadResponse {
  key: string;
}

export const UserCreationDialog = ({
  isOpen,
  onClose,
  walletAddress,
}: UserCreationDialogProps) => {
  const {
    username,
    setUsername,
    description,
    setDescription,
    isUploading,
    setIsUploading,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
  } = useUserStore();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      onClose();
      toast.success("Profile created successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getUploadUrl = api.user.getUploadUrl.useMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('walletAddress', walletAddress);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json() as UploadResponse;
      return data.key;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let pfp: string | undefined;

      if (imageFile) {
        try {
          pfp = await uploadImage(imageFile);
          console.log("Image uploaded successfully:", pfp);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          toast.error("Failed to upload image. Please try again.");
          setIsUploading(false);
          return;
        }
      }

      await createUser.mutateAsync({
        walletAddress,
        username,
        description,
        pfp,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Image (max 5MB)</Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <Input
                id="profile-image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Bio</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createUser.isPending || isUploading || getUploadUrl.isPending
              }
            >
              {createUser.isPending || isUploading
                ? "Creating..."
                : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

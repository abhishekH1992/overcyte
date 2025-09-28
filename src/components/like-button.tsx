"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { formatCount } from "@/lib/utils/format";

interface LikeButtonProps {
  postId: number;
  initialLikeCount: number;
}

export function LikeButton({ postId, initialLikeCount }: LikeButtonProps) {
  const [optimisticCount, setOptimisticCount] = useState(Math.max(0, initialLikeCount));

  // Fetch user's like status for this post
  const { data: likeStatus, refetch: refetchLikeStatus } = useQuery({
    queryKey: ["like-status", postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/like-status`);
      if (!response.ok) {
        throw new Error("Failed to fetch like status");
      }
      return response.json();
    },
  });

  const liked = likeStatus?.hasLiked || false;

  const likeMutation = useMutation({
    mutationFn: async ({ action }: { action: "like" | "unlike" }) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update like");
      }

      return response.json();
    },
    onMutate: async ({ action }) => {
      setOptimisticCount((prev) =>
        action === "like" ? prev + 1 : Math.max(0, prev - 1)
      );
    },
    onSuccess: () => {
      // Refetch like status after successful mutation
      refetchLikeStatus();
    },
    onError: (error) => {
      console.error("Like mutation failed:", error);
      setOptimisticCount(Math.max(0, initialLikeCount));
    },
  });

  const handleClick = () => {
    const action = liked ? "unlike" : "like";

    likeMutation.mutate({
      action,
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={likeMutation.isPending}
      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors
        ${
          liked
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
        ${likeMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{formatCount(optimisticCount)}</span>
      {likeMutation.isPending && <span className="animate-spin">⏳</span>}
    </button>
  );
}

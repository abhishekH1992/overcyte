"use client";

import { useState, useMemo } from "react";
import { LikeButton } from "./like-button";
import { Post, UserWithoutPassword } from "@/lib/db/types";
import { Pagination } from "./pagination";

interface PostsListProps {
  posts: (Post & {
    author: UserWithoutPassword | null;
  })[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
  onSearch?: (search: string) => void;
  onSort?: (sort: "date" | "likes") => void;
  initialSearchTerm?: string;
  initialSortBy?: "date" | "likes";
}

export function PostsList({ 
  posts, 
  pagination, 
  onPageChange, 
  onSearch, 
  onSort, 
  initialSearchTerm = "", 
  initialSortBy = "date" 
}: PostsListProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState<"date" | "likes">(initialSortBy);

  // Since search and sort are now handled server-side, we just display the posts as-is
  const processedPosts = posts;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch?.(e.target.value);
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={sortBy}
          onChange={(e) => {
            const newSort = e.target.value as "date" | "likes";
            setSortBy(newSort);
            onSort?.(newSort);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="date">Sort by Date</option>
          <option value="likes">Sort by Likes</option>
        </select>
      </div>

      <div className="space-y-4">
        {processedPosts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {post.title}
                </h3>
                <p className="text-gray-600 mt-2">{post.content}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>By {post.author?.username || "Unknown"}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <LikeButton
                  postId={post.id}
                  initialLikeCount={Math.max(0, post.likeCount)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination && onPageChange && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
        />
      )}
    </div>
  );
}

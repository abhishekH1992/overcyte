"use client";

import { useState, useEffect } from "react";
import { PostsList } from "./posts-list";
import { Post, User } from "@/lib/db/types";

interface PaginatedPostsListProps {
  initialPosts: (Post & { author: User })[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function PaginatedPostsList({ initialPosts, initialPagination }: PaginatedPostsListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${pagination.limit}`);
      const data = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loading ? "opacity-50 pointer-events-none" : ""}>
      <PostsList 
        posts={posts} 
        pagination={pagination} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
}

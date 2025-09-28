"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PostsList } from "./posts-list";
import { Post, UserWithoutPassword } from "@/lib/db/types";

interface PaginatedPostsListProps {
  initialPosts: (Post & { author: UserWithoutPassword | null })[];
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "likes">("date");

  const fetchPosts = useCallback(async (page: number, search: string, sort: "date" | "likes") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search,
        sortBy: sort,
      });
      
      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const handlePageChange = (page: number) => {
    fetchPosts(page, searchTerm, sortBy);
  };

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search by 300ms
    searchTimeoutRef.current = setTimeout(() => {
      fetchPosts(1, search, sortBy);
    }, 300);
  };

  const handleSort = (sort: "date" | "likes") => {
    setSortBy(sort);
    fetchPosts(1, searchTerm, sort);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={loading ? "opacity-50 pointer-events-none" : ""}>
      <PostsList 
        posts={posts} 
        pagination={pagination} 
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        initialSearchTerm={searchTerm}
        initialSortBy={sortBy}
      />
    </div>
  );
}

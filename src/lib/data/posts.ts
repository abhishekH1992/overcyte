import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllPosts() {
  return await db.select().from(posts);
}

export async function getPostsWithAuthors() {
  return await db.query.posts.findMany({
    with: {
      author: true,
    },
  });
}

export async function getPostsWithAuthorsPaginated(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  
  const postsData = await db.query.posts.findMany({
    with: {
      author: true,
    },
    orderBy: [desc(posts.createdAt)],
    limit,
    offset,
  });

  const totalCount = await db.select({ count: posts.id }).from(posts);
  const total = totalCount.length;

  return {
    posts: postsData,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

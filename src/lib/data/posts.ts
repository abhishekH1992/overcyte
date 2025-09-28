import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, desc, asc, like, or, sql } from "drizzle-orm";

export async function getAllPosts() {
  return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostsWithAuthors() {
  return await db.query.posts.findMany({
    with: {
      author: true,
    },
  });
}

export async function getPostsWithAuthorsPaginated(
  page: number = 1, 
  limit: number = 10,
  searchTerm: string = "",
  sortBy: "date" | "likes" = "date"
) {
  const offset = (page - 1) * limit;
  
  // Build search conditions
  const searchConditions = searchTerm 
    ? or(
        like(posts.title, `%${searchTerm}%`),
        like(posts.content, `%${searchTerm}%`)
      )
    : undefined;

  // Build order by clause
  const orderBy = sortBy === "likes" 
    ? [desc(posts.likeCount), desc(posts.createdAt)]
    : [desc(posts.createdAt)];

  // Get posts with search and sort
  let postsData;
  let totalCount;

  if (searchTerm) {
    // When searching, we need to join with users table to search by username
    const searchWithUsername = or(
      like(posts.title, `%${searchTerm}%`),
      like(posts.content, `%${searchTerm}%`),
      like(users.username, `%${searchTerm}%`)
    );

    // Get posts with author data using manual query
    const postsQuery = db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        authorId: posts.authorId,
        likeCount: posts.likeCount,
        createdAt: posts.createdAt,
        author: {
          id: users.id,
          username: users.username,
          createdAt: users.createdAt,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(searchWithUsername);

    // Apply ordering
    if (sortBy === "likes") {
      postsQuery.orderBy(desc(posts.likeCount), desc(posts.createdAt));
    } else {
      postsQuery.orderBy(desc(posts.createdAt));
    }

    // Apply pagination
    postsQuery.limit(limit).offset(offset);
    
    postsData = await postsQuery;

    // Get total count
    const countResult = await db
      .select({ count: posts.id })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(searchWithUsername);
    
    totalCount = countResult;
  } else {
    // No search - use the optimized query
    postsData = await db.query.posts.findMany({
      with: {
        author: true,
      },
      orderBy,
      limit,
      offset,
    });

    // Get total count
    const countResult = await db.select({ count: posts.id }).from(posts);
    totalCount = countResult;
  }

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

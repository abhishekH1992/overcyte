import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserById(userId: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  if (!user) return null;
  
  // Exclude sensitive data (hashedPassword) from the response
  const { hashedPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserWithPosts(userId: number) {
  const user = await getUserById(userId);
  if (!user) return null;

  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, userId));

  return {
    ...user,
    posts: userPosts,
  };
}

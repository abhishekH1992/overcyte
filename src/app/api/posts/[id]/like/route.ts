import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, postLikes } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/utils";
import { eq, sql, and } from "drizzle-orm";
import { z } from "zod";

const payloadSchema = z.object({
  action: z.enum(["like", "unlike"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const rawBody = await request.json();
    const validationResult = payloadSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { action } = validationResult.data;

    // Check if user has already liked this post
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(and(
        eq(postLikes.userId, session.userId),
        eq(postLikes.postId, postId)
      ))
      .limit(1);

    const hasLiked = existingLike.length > 0;

    if (action === "like") {
      if (hasLiked) {
        return NextResponse.json({ 
          error: "You have already liked this post" 
        }, { status: 400 });
      }

      // Add like record
      await db.insert(postLikes).values({
        userId: session.userId,
        postId: postId,
        createdAt: new Date(),
      });

      // Increment like count, but if current count is negative, set to 1
      await db
        .update(posts)
        .set({
          likeCount: sql`CASE WHEN ${posts.likeCount} < 0 THEN 1 ELSE ${posts.likeCount} + 1 END`
        })
        .where(eq(posts.id, postId));
    } else {
      if (!hasLiked) {
        return NextResponse.json({ 
          error: "You haven't liked this post yet" 
        }, { status: 400 });
      }

      // Remove like record
      await db
        .delete(postLikes)
        .where(and(
          eq(postLikes.userId, session.userId),
          eq(postLikes.postId, postId)
        ));

      // Decrement like count
      await db
        .update(posts)
        .set({
          likeCount: sql`CASE WHEN ${posts.likeCount} > 0 THEN ${posts.likeCount} - 1 ELSE 0 END`
        })
        .where(eq(posts.id, postId));
    }

    const [updatedPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    return NextResponse.json({
      success: true,
      post: updatedPost,
      hasLiked: action === "like",
      message: `Post ${action}d successfully`,
    });
  } catch (error) {
    console.error("Like/unlike error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { postLikes } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/utils";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Check if user has liked this post
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(and(
        eq(postLikes.userId, session.userId),
        eq(postLikes.postId, postId)
      ))
      .limit(1);

    const hasLiked = existingLike.length > 0;

    return NextResponse.json({
      success: true,
      hasLiked,
    });
  } catch (error) {
    console.error("Get like status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

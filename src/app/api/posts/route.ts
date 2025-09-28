import { NextRequest, NextResponse } from "next/server";
import { getPostsWithAuthorsPaginated } from "@/lib/data/posts";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = (searchParams.get("sortBy") as "date" | "likes") || "date";

    const result = await getPostsWithAuthorsPaginated(page, limit, search, sortBy);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { analyzeQuery, analyzeQueries } from "@/lib/utils/query-analyzer";

export async function POST(request: NextRequest) {
  try {
    const { queries } = await request.json();
    
    if (!queries || !Array.isArray(queries)) {
      return NextResponse.json({ error: "Invalid queries array" }, { status: 400 });
    }
    
    const results = await analyzeQueries(queries);
    
    return NextResponse.json({
      success: true,
      analyses: results
    });
  } catch (error) {
    console.error("Query analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze queries" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Example queries to analyze
  const exampleQueries = [
    {
      query: "SELECT * FROM posts ORDER BY created_at DESC LIMIT 10",
      params: []
    },
    {
      query: "SELECT * FROM posts WHERE title LIKE ? ORDER BY like_count DESC",
      params: ["%test%"]
    },
    {
      query: "SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.author_id = u.id",
      params: []
    }
  ];
  
  try {
    const results = await analyzeQueries(exampleQueries);
    
    return NextResponse.json({
      success: true,
      exampleAnalyses: results
    });
  } catch (error) {
    console.error("Example query analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze example queries" },
      { status: 500 }
    );
  }
}

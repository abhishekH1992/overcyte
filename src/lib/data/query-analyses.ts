import { db } from "@/lib/db";
import { queryAnalyses } from "@/lib/db/schema";
import { desc, eq, and, gte, lte, count, avg } from "drizzle-orm";

export async function getQueryAnalyses(
  page: number = 1,
  limit: number = 50,
  hasTableScan?: boolean,
  minExecutionTime?: number,
  maxExecutionTime?: number
) {
  const offset = (page - 1) * limit;
  
  // Build filter conditions
  const conditions = [];
  
  if (hasTableScan !== undefined) {
    conditions.push(eq(queryAnalyses.hasTableScan, hasTableScan));
  }
  
  if (minExecutionTime !== undefined) {
    conditions.push(gte(queryAnalyses.executionTime, minExecutionTime));
  }
  
  if (maxExecutionTime !== undefined) {
    conditions.push(lte(queryAnalyses.executionTime, maxExecutionTime));
  }
  
  // Get query analyses with filters
  const analyses = await db
    .select()
    .from(queryAnalyses)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(queryAnalyses.createdAt))
    .limit(limit)
    .offset(offset);
  
  // Get total count
  const totalCount = await db
    .select({ count: queryAnalyses.id })
    .from(queryAnalyses)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  
  const total = totalCount.length;
  
  return {
    analyses,
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

export async function getQueryAnalysisStats() {
  // Get total queries count
  const [totalQueriesResult] = await db
    .select({ count: count() })
    .from(queryAnalyses);
  const totalQueries = totalQueriesResult.count;
  
  // Get table scan queries count
  const [tableScanQueriesResult] = await db
    .select({ count: count() })
    .from(queryAnalyses)
    .where(eq(queryAnalyses.hasTableScan, true));
  const tableScanQueries = tableScanQueriesResult.count;
  
  // Get average execution time
  const [avgExecutionTimeResult] = await db
    .select({ avg: avg(queryAnalyses.executionTime) })
    .from(queryAnalyses);
  const avgExecutionTime = avgExecutionTimeResult.avg ? Number(avgExecutionTimeResult.avg) : 0;
  
  // Get slow queries count
  const [slowQueriesResult] = await db
    .select({ count: count() })
    .from(queryAnalyses)
    .where(gte(queryAnalyses.executionTime, 100)); // Queries > 100ms
  const slowQueries = slowQueriesResult.count;
  
  return {
    totalQueries,
    tableScanQueries,
    avgExecutionTime,
    slowQueries,
    tableScanPercentage: totalQueries > 0 ? (tableScanQueries / totalQueries) * 100 : 0,
  };
}

export async function getTopSlowQueries(limit: number = 10) {
  return await db
    .select()
    .from(queryAnalyses)
    .orderBy(desc(queryAnalyses.executionTime))
    .limit(limit);
}

export async function getMostFrequentQueries(limit: number = 10) {
  // This would require a more complex query to group by query text
  // For now, return recent queries
  return await db
    .select()
    .from(queryAnalyses)
    .orderBy(desc(queryAnalyses.createdAt))
    .limit(limit);
}

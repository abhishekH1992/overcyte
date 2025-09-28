import { db } from '@/lib/db';
import { createClient } from '@libsql/client';

/**
 * Query analysis utilities using EXPLAIN ANALYZE
 */

export interface QueryPlan {
  id: number;
  parent: number;
  notused: number;
  detail: string;
}

export interface QueryAnalysis {
  query: string;
  params: unknown[];
  plan: QueryPlan[];
  hasTableScan: boolean;
  hasIndexUsage: boolean;
  estimatedCost: number;
  warnings: string[];
}

/**
 * Analyze a query using EXPLAIN QUERY PLAN
 */
export async function analyzeQuery(query: string, params: unknown[] = []): Promise<QueryAnalysis> {
  try {
    // Create a direct client for raw SQL execution
    const client = createClient({ url: 'file:./db.sqlite' });
    
    // Execute EXPLAIN QUERY PLAN
    const explainQuery = `EXPLAIN QUERY PLAN ${query}`;
    const result = await client.execute(explainQuery, params as any);
    
    const plan: QueryPlan[] = result.rows.map((row: any) => ({
      id: row.id || 0,
      parent: row.parent || 0,
      notused: row.notused || 0,
      detail: row.detail || ''
    }));
    
    // Analyze the plan
    const planText = plan.map(p => p.detail).join('\n');
    const hasTableScan = planText.includes('SCAN TABLE') || planText.includes('FULL TABLE SCAN');
    const hasIndexUsage = planText.includes('INDEX') || planText.includes('USING INDEX');
    
    // Extract cost information
    const costMatch = planText.match(/cost=(\d+\.?\d*)/);
    const estimatedCost = costMatch ? parseFloat(costMatch[1]) : 0;
    
    // Generate warnings
    const warnings: string[] = [];
    if (hasTableScan) {
      warnings.push('Query performs table scan - consider adding indexes');
    }
    if (estimatedCost > 100) {
      warnings.push(`High estimated cost: ${estimatedCost}`);
    }
    if (planText.includes('TEMPORARY TABLE')) {
      warnings.push('Query creates temporary table - may be slow');
    }
    
    return {
      query,
      params,
      plan,
      hasTableScan,
      hasIndexUsage,
      estimatedCost,
      warnings
    };
  } catch (error) {
    console.error('Query analysis failed:', error);
    return {
      query,
      params,
      plan: [],
      hasTableScan: false,
      hasIndexUsage: false,
      estimatedCost: 0,
      warnings: [`Analysis failed: ${error}`]
    };
  }
}

/**
 * Analyze multiple queries and return a summary
 */
export async function analyzeQueries(queries: Array<{ query: string; params?: unknown[] }>): Promise<QueryAnalysis[]> {
  const results: QueryAnalysis[] = [];
  
  for (const { query, params = [] } of queries) {
    const analysis = await analyzeQuery(query, params);
    results.push(analysis);
  }
  
  return results;
}

/**
 * Get query performance recommendations
 */
export function getQueryRecommendations(analysis: QueryAnalysis): string[] {
  const recommendations: string[] = [];
  
  if (analysis.hasTableScan) {
    recommendations.push('Add indexes on columns used in WHERE, ORDER BY, or JOIN clauses');
  }
  
  if (analysis.estimatedCost > 50) {
    recommendations.push('Consider query optimization or adding more specific indexes');
  }
  
  if (analysis.plan.some(p => p.detail.includes('SORT'))) {
    recommendations.push('Sorting detected - ensure ORDER BY columns are indexed');
  }
  
  if (analysis.plan.some(p => p.detail.includes('GROUP BY'))) {
    recommendations.push('Grouping detected - consider indexes on GROUP BY columns');
  }
  
  return recommendations;
}

/**
 * Log query analysis results
 */
export function logQueryAnalysis(analysis: QueryAnalysis): void {
  console.group(`[QUERY ANALYSIS] ${analysis.query.substring(0, 50)}...`);
  console.log('Plan:', analysis.plan);
  console.log('Has Table Scan:', analysis.hasTableScan);
  console.log('Has Index Usage:', analysis.hasIndexUsage);
  console.log('Estimated Cost:', analysis.estimatedCost);
  
  if (analysis.warnings.length > 0) {
    console.warn('Warnings:', analysis.warnings);
  }
  
  const recommendations = getQueryRecommendations(analysis);
  if (recommendations.length > 0) {
    console.info('Recommendations:', recommendations);
  }
  
  console.groupEnd();
}

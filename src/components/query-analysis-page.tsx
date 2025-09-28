"use client";

import { useState } from "react";
import { QueryAnalysis } from "@/lib/db/types";
import { formatCount } from "@/lib/utils/format";

interface QueryAnalysisPageProps {
  initialStats: {
    totalQueries: number;
    tableScanQueries: number;
    avgExecutionTime: number;
    slowQueries: number;
    tableScanPercentage: number;
  };
  initialSlowQueries: QueryAnalysis[];
}

export function QueryAnalysisPage({
  initialStats,
  initialSlowQueries,
}: QueryAnalysisPageProps) {
  const [stats, setStats] = useState(initialStats);
  const [slowQueries, setSlowQueries] = useState(initialSlowQueries);



  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Queries</h3>
          <p className="text-2xl font-bold text-blue-700">{formatCount(stats.totalQueries)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900">Table Scans</h3>
          <p className="text-2xl font-bold text-red-700">
            {formatCount(stats.tableScanQueries)} ({stats.tableScanPercentage.toFixed(1)}%)
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900">Avg Time</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {typeof stats.avgExecutionTime === 'number' ? stats.avgExecutionTime.toFixed(1) : '0.0'}ms
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900">Slow Queries</h3>
          <p className="text-2xl font-bold text-orange-700">{formatCount(stats.slowQueries)}</p>
        </div>
      </div>

      {/* Top Slow Queries */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Slow Queries</h3>
        <span className="text-sm text-gray-500">If execution time is greater than 100ms, action is needed</span>
        <div className="space-y-4 mt-4">
          {slowQueries.map((query) => (
            <div key={query.id} className={`border-l-4 pl-4 py-3 ${query.executionTime < 100 ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <code className="text-sm bg-gray-100 p-3 rounded block whitespace-pre-wrap">
                    {query.query}
                  </code>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-lg font-bold ${query.executionTime < 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {query.executionTime}ms
                  </div>
                  <div className={`text-sm px-2 py-1 rounded-full text-xs font-medium ${
                    query.executionTime < 100 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {query.executionTime < 100 ? 'No Action Needed' : 'Slow Query'}
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { getQueryAnalysisStats, getTopSlowQueries } from "@/lib/data/query-analyses";
import { QueryAnalysisPage } from "@/components/query-analysis-page";
import Link from "next/link";

export default async function AnalyzeQueryPage() {
  const [stats, slowQueries] = await Promise.all([
    getQueryAnalysisStats(),
    getTopSlowQueries(5),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Query Analysis</h1>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <QueryAnalysisPage
            initialStats={stats}
            initialSlowQueries={slowQueries}
          />
        </div>
      </main>
    </div>
  );
}

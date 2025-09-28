import { PerformanceDemoList } from "@/components/performance-demo-list";
import Link from "next/link";

export default function PerformanceDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
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
      <PerformanceDemoList />
    </div>
  );
}

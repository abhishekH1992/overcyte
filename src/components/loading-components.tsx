export function DashboardStatsLoading() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900">Users</h3>
        <div className="h-8 bg-blue-200 rounded animate-pulse mt-2"></div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900">Posts</h3>
        <div className="h-8 bg-green-200 rounded animate-pulse mt-2"></div>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-900">Likes</h3>
        <div className="h-8 bg-red-200 rounded animate-pulse mt-2"></div>
      </div>
    </div>
  );
}

export function PrefetchedPostsLoading() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Latest Posts</h3>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-md">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
        </div>
      ))}
    </div>
  );
}

export function PostsListLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-3"></div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PerformanceDemoLoading() {
  return (
    <div className="space-y-6">
      {/* Controls skeleton */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-16"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-20"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-16"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-24"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-3"></div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
      </div>
    </div>
  );
}

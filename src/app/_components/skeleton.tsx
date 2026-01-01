export function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-white border border-gray-200 p-5 shadow-sm dark:bg-white/10 dark:border-transparent dark:backdrop-blur-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar skeleton */}
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-white/20" />
          <div>
            {/* Name skeleton */}
            <div className="mb-1.5 h-5 w-32 rounded bg-gray-300 dark:bg-white/20" />
            {/* Date skeleton */}
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/15" />
          </div>
        </div>
      </div>
      {/* Message skeleton */}
      <div className="space-y-2 pl-[52px]">
        <div className="h-4 w-full rounded bg-gray-300 dark:bg-white/20" />
        <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-white/20" />
        <div className="h-4 w-4/6 rounded bg-gray-300 dark:bg-white/20" />
      </div>
    </div>
  );
}

export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-64 rounded bg-gray-300 dark:bg-white/20 animate-pulse" />
        <div className="h-7 w-24 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
      </div>

      {/* Search skeleton */}
      <div className="h-12 w-full rounded-lg bg-gray-200 border border-gray-300 dark:bg-white/10 dark:border-transparent animate-pulse" />

      {/* Post skeletons */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm dark:bg-white/10 dark:border-transparent dark:backdrop-blur-sm animate-pulse">
          <div className="mb-2 h-9 w-16 rounded bg-gray-300 dark:bg-white/20" />
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-white/15" />
        </div>
      ))}
    </div>
  );
}

export function AdminPostSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-white border border-gray-200 p-6 shadow-sm dark:bg-white/10 dark:border-transparent dark:backdrop-blur-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-white/20" />
            <div>
              {/* Name skeleton */}
              <div className="mb-2 h-5 w-40 rounded bg-gray-300 dark:bg-white/20" />
              {/* Date skeleton */}
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-white/15" />
            </div>
          </div>
          {/* Message skeleton */}
          <div className="mt-2 space-y-2">
            <div className="h-4 w-full rounded bg-gray-300 dark:bg-white/20" />
            <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-white/20" />
            <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-white/20" />
          </div>
        </div>
        {/* Status badge skeleton */}
        <div className="ml-4 h-7 w-24 rounded bg-gray-300 dark:bg-white/20" />
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <div className="h-9 w-20 rounded bg-gray-300 dark:bg-white/20" />
        <div className="h-9 w-20 rounded bg-gray-300 dark:bg-white/20" />
        <div className="h-9 w-32 rounded bg-gray-300 dark:bg-white/20" />
      </div>
    </div>
  );
}

export function AdminPostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <AdminPostSkeleton key={i} />
      ))}
    </div>
  );
}

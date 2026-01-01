"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { StatsSkeleton, AdminPostListSkeleton } from "~/app/_components/skeleton";

type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function AdminPage() {
  const [selectedStatus, setSelectedStatus] = useState<ModerationStatus | "ALL">("PENDING");
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple authentication check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (adminKey === process.env.NEXT_PUBLIC_ADMIN_KEY || adminKey === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid admin key");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white px-4">
        <div className="w-full max-w-md rounded-lg bg-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          <h1 className="mb-6 text-2xl sm:text-3xl font-bold">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="adminKey" className="mb-2 block text-sm font-medium">
                Admin Key
              </label>
              <input
                id="adminKey"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full rounded-lg bg-white/20 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter admin key"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-white/20 px-4 py-3 font-semibold transition hover:bg-white/30 active:scale-98"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return <AdminPanelContent selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />;
}

function AdminPanelContent({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: ModerationStatus | "ALL";
  setSelectedStatus: (status: ModerationStatus | "ALL") => void;
}) {
  const { data: stats, isLoading: statsLoading } = api.post.getModerationStats.useQuery();
  const { data, fetchNextPage, hasNextPage, isLoading } = api.post.getAllForModeration.useInfiniteQuery(
    {
      limit: 10,
      status: selectedStatus === "ALL" ? undefined : selectedStatus,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const utils = api.useUtils();
  const moderateMutation = api.post.moderate.useMutation({
    onSuccess: () => {
      void utils.post.getAllForModeration.invalidate();
      void utils.post.getModerationStats.invalidate();
    },
  });

  const handleModerate = (id: number, status: ModerationStatus) => {
    moderateMutation.mutate({ id, status });
  };

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Moderation Panel</h1>
          <a
            href="/"
            className="rounded-lg bg-white/20 px-4 py-2.5 sm:py-2 transition hover:bg-white/30 active:scale-98 text-center"
          >
            Back to Site
          </a>
        </div>

        {/* Stats */}
        {statsLoading ? (
          <StatsSkeleton />
        ) : stats ? (
          <div className="mb-6 sm:mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white/10 p-4 sm:p-5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold">{stats.pending}</div>
              <div className="text-xs sm:text-sm text-white/70">Pending</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 sm:p-5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold">{stats.approved}</div>
              <div className="text-xs sm:text-sm text-white/70">Approved</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 sm:p-5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold">{stats.rejected}</div>
              <div className="text-xs sm:text-sm text-white/70">Rejected</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 sm:p-5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold">{stats.total}</div>
              <div className="text-xs sm:text-sm text-white/70">Total</div>
            </div>
          </div>
        ) : null}

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-4 py-2.5 sm:py-2 text-sm sm:text-base transition active:scale-95 ${
                selectedStatus === status
                  ? "bg-white text-[#2e026d] font-semibold"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Posts */}
        {isLoading ? (
          <AdminPostListSkeleton />
        ) : posts.length === 0 ? (
          <div className="rounded-lg bg-white/10 p-6 sm:p-8 text-center backdrop-blur-sm text-sm sm:text-base">
            No posts to moderate
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg bg-white/10 p-4 sm:p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-center gap-3">
                      {post.avatarSeed && (
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.avatarSeed}`}
                          alt={`${post.name}'s avatar`}
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold truncate">{post.name}</h3>
                        <p className="text-xs sm:text-sm text-white/70">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-white/90 break-words">{post.message}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-block rounded px-3 py-1 text-xs sm:text-sm font-semibold ${
                        post.moderationStatus === "APPROVED"
                          ? "bg-green-500/20 text-green-300"
                          : post.moderationStatus === "REJECTED"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {post.moderationStatus}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleModerate(post.id, "APPROVED")}
                    disabled={moderateMutation.isPending || post.moderationStatus === "APPROVED"}
                    className="rounded bg-green-600 px-4 py-2.5 sm:py-2 text-sm font-semibold transition hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleModerate(post.id, "REJECTED")}
                    disabled={moderateMutation.isPending || post.moderationStatus === "REJECTED"}
                    className="rounded bg-red-600 px-4 py-2.5 sm:py-2 text-sm font-semibold transition hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleModerate(post.id, "PENDING")}
                    disabled={moderateMutation.isPending || post.moderationStatus === "PENDING"}
                    className="rounded bg-yellow-600 px-4 py-2.5 sm:py-2 text-sm font-semibold transition hover:bg-yellow-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset to Pending
                  </button>
                </div>
              </div>
            ))}

            {hasNextPage && (
              <button
                onClick={() => void fetchNextPage()}
                className="w-full rounded-lg bg-white/20 px-4 py-3 sm:py-2 transition hover:bg-white/30 active:scale-98 text-sm sm:text-base"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

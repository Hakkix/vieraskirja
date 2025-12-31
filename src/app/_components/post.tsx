"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export function GuestbookForm() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
      setMessage("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name, message });
      }}
      className="flex w-full max-w-2xl flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/50"
        required
      />
      <textarea
        placeholder="Your message (max 500 characters)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={500}
        rows={4}
        className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/50"
        required
      />
      <button
        type="submit"
        className="rounded-lg bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Submitting..." : "Sign Guestbook"}
      </button>
    </form>
  );
}

export function GuestbookEntries() {
  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.post.getAll.useSuspenseInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  const allPosts = data.pages.flatMap((page) => page.posts);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <h2 className="text-2xl font-bold">Guestbook Entries</h2>
      {allPosts.length === 0 ? (
        <p className="text-white/70">No entries yet. Be the first to sign!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {allPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg bg-white/10 p-4 backdrop-blur-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-white">{post.name}</h3>
                <span className="text-sm text-white/50">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white/90">{post.message}</p>
            </div>
          ))}
        </div>
      )}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="rounded-lg bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

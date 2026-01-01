"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { TRPCClientErrorLike } from "@trpc/client";
import { z } from "zod";

import { api } from "~/trpc/react";
import type { AppRouter } from "~/server/api/root";

// Client-side validation schema matching server schema
const guestbookSchema = z.object({
  name: z.string().min(1, "Nimi on pakollinen"),
  message: z.string().min(1, "Viesti on pakollinen").max(500, "Viestin maksimipituus on 500 merkkiä"),
});

type ValidationErrors = {
  name?: string;
  message?: string;
};

export function GuestbookForm() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
      setMessage("");
      setShowSuccess(true);
      setValidationErrors({});
      setServerError(null);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      // Handle server-side errors
      setServerError(error.message ?? "An error occurred. Please try again.");
    },
  });

  const characterCount = message.length;
  const maxCharacters = 500;
  const characterWarning = characterCount > maxCharacters * 0.9;

  // Validate form before submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});
    setServerError(null);

    // Validate input
    const result = guestbookSchema.safeParse({ name, message });

    if (!result.success) {
      // Extract validation errors
      const errors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ValidationErrors;
        if (field) {
          errors[field] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    // Submit if validation passes
    createPost.mutate({ name, message });
  };

  // Clear field error on input change
  const handleNameChange = (value: string) => {
    setName(value);
    if (validationErrors.name) {
      setValidationErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    if (validationErrors.message) {
      setValidationErrors((prev) => ({ ...prev, message: undefined }));
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4"
        noValidate
      >
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-white/90">
            Nimi
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nimesi"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={`w-full rounded-lg bg-white/15 px-4 py-3 text-white placeholder:text-white/70 transition-all duration-200 focus:bg-white/20 focus:outline-none focus:ring-2 ${
              validationErrors.name
                ? "ring-2 ring-red-500/50 focus:ring-red-500/70"
                : "focus:ring-white/30"
            }`}
            disabled={createPost.isPending}
            aria-label="Nimi"
            aria-invalid={!!validationErrors.name}
            aria-describedby={validationErrors.name ? "name-error" : undefined}
          />
          {validationErrors.name && (
            <p id="name-error" className="text-sm text-red-400 flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {validationErrors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-white/90">
            Viesti
          </label>
          <textarea
            id="message"
            placeholder="Jaa ajatuksesi..."
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            maxLength={maxCharacters}
            rows={4}
            className={`w-full resize-none rounded-lg bg-white/15 px-4 py-3 text-white placeholder:text-white/70 transition-all duration-200 focus:bg-white/20 focus:outline-none focus:ring-2 ${
              validationErrors.message
                ? "ring-2 ring-red-500/50 focus:ring-red-500/70"
                : "focus:ring-white/30"
            }`}
            disabled={createPost.isPending}
            aria-label="Viesti"
            aria-invalid={!!validationErrors.message}
            aria-describedby={validationErrors.message ? "message-error" : undefined}
          />
          {validationErrors.message && (
            <p id="message-error" className="text-sm text-red-400 flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {validationErrors.message}
            </p>
          )}
          <div className="flex items-center justify-between text-sm">
            <span
              className={`transition-colors ${
                characterWarning ? "text-yellow-400" : "text-white/60"
              }`}
            >
              {characterCount} / {maxCharacters} merkkiä
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 px-10 py-3 font-semibold text-white shadow-lg shadow-teal-500/30 transition-all duration-200 hover:from-teal-400 hover:to-cyan-400 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              Lähetetään...
            </span>
          ) : (
            "Kirjoita vieraskirjaan"
          )}
        </button>
      </form>

      {showSuccess && (
        <div className="animate-fade-in rounded-lg bg-green-500/20 border border-green-500/30 px-4 py-3 text-green-100">
          <p className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            Kiitos vieraskirjamerkinnästäsi!
          </p>
        </div>
      )}

      {serverError && (
        <div className="animate-fade-in rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-3 text-red-100">
          <p className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {serverError}
          </p>
        </div>
      )}
    </div>
  );
}

export function GuestbookEntries() {
  const utils = api.useUtils();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editErrors, setEditErrors] = useState<ValidationErrors>({});

  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.post.getAll.useSuspenseInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  const allPosts = data.pages.flatMap((page) => page.posts);

  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

  const updatePost = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setEditingId(null);
      setEditErrors({});
    },
  });

  const handleEdit = (post: { id: number; name: string; message: string }) => {
    setEditingId(post.id);
    setEditName(post.name);
    setEditMessage(post.message);
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditMessage("");
    setEditErrors({});
  };

  const handleSaveEdit = (id: number) => {
    // Clear previous errors
    setEditErrors({});

    // Validate input
    const result = guestbookSchema.safeParse({ name: editName, message: editMessage });

    if (!result.success) {
      // Extract validation errors
      const errors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ValidationErrors;
        if (field) {
          errors[field] = issue.message;
        }
      });
      setEditErrors(errors);
      return;
    }

    // Submit if validation passes
    updatePost.mutate({ id, name: editName, message: editMessage });
  };

  const handleDelete = (id: number) => {
    if (confirm("Haluatko varmasti poistaa tämän viestin?")) {
      deletePost.mutate({ id });
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? "Juuri nyt" : `${diffInMinutes}min sitten`;
      }
      return diffInHours === 1 ? "1t sitten" : `${diffInHours}t sitten`;
    }
    if (diffInDays === 1) return "Eilen";
    if (diffInDays < 7) return `${diffInDays}pv sitten`;

    return postDate.toLocaleDateString("fi-FI", {
      month: "short",
      day: "numeric",
      year: postDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Vieraskirjamerkinnät</h2>
        {allPosts.length > 0 && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/70">
            {allPosts.length} {allPosts.length === 1 ? "merkintä" : "merkintää"}
          </span>
        )}
      </div>

      {allPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 py-16 px-4">
          <svg
            className="mb-4 h-16 w-16 text-white/30"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <p className="text-lg font-medium text-white/70">Ei vielä merkintöjä</p>
          <p className="text-sm text-white/50">Ole ensimmäinen kirjoittamassa vieraskirjaan!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {allPosts.map((post, index) => {
            const isEditing = editingId === post.id;

            return (
              <div
                key={post.id}
                className="group rounded-lg bg-white/10 p-5 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.15] animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {isEditing ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label htmlFor={`edit-name-${post.id}`} className="block text-sm font-medium text-white/90">
                        Nimi
                      </label>
                      <input
                        id={`edit-name-${post.id}`}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={`w-full rounded-lg bg-white/15 px-4 py-2 text-white placeholder:text-white/70 transition-all duration-200 focus:bg-white/20 focus:outline-none focus:ring-2 ${
                          editErrors.name
                            ? "ring-2 ring-red-500/50 focus:ring-red-500/70"
                            : "focus:ring-white/30"
                        }`}
                      />
                      {editErrors.name && (
                        <p className="text-sm text-red-400">{editErrors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`edit-message-${post.id}`} className="block text-sm font-medium text-white/90">
                        Viesti
                      </label>
                      <textarea
                        id={`edit-message-${post.id}`}
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        maxLength={500}
                        rows={3}
                        className={`w-full resize-none rounded-lg bg-white/15 px-4 py-2 text-white placeholder:text-white/70 transition-all duration-200 focus:bg-white/20 focus:outline-none focus:ring-2 ${
                          editErrors.message
                            ? "ring-2 ring-red-500/50 focus:ring-red-500/70"
                            : "focus:ring-white/30"
                        }`}
                      />
                      {editErrors.message && (
                        <p className="text-sm text-red-400">{editErrors.message}</p>
                      )}
                      <div className="text-sm text-white/60">
                        {editMessage.length} / 500 merkkiä
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        disabled={updatePost.isPending}
                        className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-400 hover:to-emerald-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatePost.isPending ? "Tallennetaan..." : "Tallenna"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updatePost.isPending}
                        className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Peruuta
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 font-bold text-white shadow-lg">
                          {post.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{post.name}</h3>
                          <time className="text-xs text-white/50" dateTime={post.createdAt.toISOString()}>
                            {formatDate(post.createdAt)}
                          </time>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(post)}
                          className="rounded-lg bg-white/10 p-2 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-110"
                          title="Muokkaa"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deletePost.isPending}
                          className="rounded-lg bg-white/10 p-2 text-red-400/70 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Poista"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-white/90 leading-relaxed pl-[52px]">{post.message}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-teal-500/30 transition-all duration-200 hover:from-teal-400 hover:to-cyan-400 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
        >
          {isFetchingNextPage ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              Ladataan...
            </span>
          ) : (
            "Lataa lisää"
          )}
        </button>
      )}
    </div>
  );
}

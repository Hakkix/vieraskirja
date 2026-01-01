"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center gap-8 px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Oho!
          </h1>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Jotain meni pieleen
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-md px-4">
            Pahoittelemme! Tapahtui odottamaton virhe. Yritä ladata sivu
            uudelleen.
          </p>
          {error.digest && (
            <p className="text-sm text-white/60 font-mono mt-2">
              Virhekoodi: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20 active:bg-white/30 border border-white/20"
          >
            Yritä uudelleen
          </button>
          <Link
            href="/"
            className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20 active:bg-white/30 border border-white/20"
          >
            Palaa etusivulle
          </Link>
        </div>

        <div className="mt-8 opacity-50">
          <svg
            className="h-32 w-32 sm:h-40 sm:w-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
    </main>
  );
}

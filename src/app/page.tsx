import { Suspense } from "react";
import { GuestbookForm, GuestbookEntries } from "~/app/_components/post";
import { PostListSkeleton } from "~/app/_components/skeleton";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.post.getAll.prefetchInfinite({ limit: 10 });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center gap-8 px-4 py-12 sm:gap-12 sm:py-16 md:py-20">
          <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[5rem] bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Vieraskirja
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-md px-4">
              Kirjoita vieraskirjaamme ja jätä viestisi!
            </p>
          </div>

          <GuestbookForm />

          <div className="my-4 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <Suspense fallback={<PostListSkeleton />}>
            <GuestbookEntries />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}

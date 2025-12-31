import { GuestbookForm, GuestbookEntries } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.post.getAll.prefetchInfinite({ limit: 10 });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 sm:py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Vieraskirja
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-md">
              Sign our guestbook and leave a message!
            </p>
          </div>

          <GuestbookForm />

          <div className="my-4 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <GuestbookEntries />
        </div>
      </main>
    </HydrateClient>
  );
}

import { GuestbookForm, GuestbookEntries } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.post.getAll.prefetchInfinite({ limit: 10 });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Vieraskirja
          </h1>
          <p className="text-xl text-white/70">
            Sign our guestbook and leave a message!
          </p>

          <GuestbookForm />

          <div className="my-8 h-px w-full max-w-2xl bg-white/20" />

          <GuestbookEntries />
        </div>
      </main>
    </HydrateClient>
  );
}

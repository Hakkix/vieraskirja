import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center gap-8 px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-8xl font-extrabold tracking-tight sm:text-9xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Sivua ei löytynyt
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-md px-4">
            Valitettavasti etsimääsi sivua ei ole olemassa. Tarkista osoite tai
            palaa etusivulle.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20 active:bg-white/30 border border-white/20"
        >
          Palaa etusivulle
        </Link>

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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </main>
  );
}

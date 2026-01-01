import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { ThemeToggle } from "~/components/theme-toggle";

export const metadata: Metadata = {
  title: "Vieraskirja | Sign Our Guestbook",
  description: "Leave your mark! Sign our guestbook and share your thoughts with the world.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <TRPCReactProvider>
            <ThemeToggle />
            {children}
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

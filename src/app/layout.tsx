import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { ThemeToggle } from "~/components/theme-toggle";

export const metadata: Metadata = {
  title: "Vieraskirja | Sign Our Guestbook",
  description: "Leave your mark! Sign our guestbook and share your thoughts with the world.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
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

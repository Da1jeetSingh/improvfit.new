import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const horizon = localFont({
  src: "../public/fonts/horizon.woff",
  variable: "--font-horizon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IMPROV — Cricket Performance Tracking",
  description:
    "Track training, match performance, and goals. Know if you're actually getting better with IMPROV — the cricket performance platform for serious players.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${horizon.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

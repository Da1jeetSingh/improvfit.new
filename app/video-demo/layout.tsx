import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IMPROV Video Demo",
  robots: "noindex, nofollow",
};

export default function VideoDemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

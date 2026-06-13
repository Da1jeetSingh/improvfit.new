import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { getSession, protectedRoutes } from "@/lib/auth";

const navLinks = protectedRoutes.map((href) => ({
  href,
  label: href.slice(1).charAt(0).toUpperCase() + href.slice(2),
}));

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 py-8">
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/dashboard" className="text-lg font-semibold text-zinc-900">
            IMPROV
          </Link>
          <p className="mt-1 text-sm text-zinc-500">{session.user.email}</p>
        </div>
        <LogoutButton />
      </header>

      <nav className="mb-8 flex flex-wrap gap-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}

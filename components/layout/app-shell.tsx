"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandHeader } from "@/components/brand/brand-header";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/weekly", label: "Weekly" },
  { href: "/stats", label: "Stats" },
  { href: "/profile", label: "Profile" },
  { href: "/training", label: "Training" },
  { href: "/matches", label: "Matches" },
  { href: "/goals", label: "Goals" },
] as const;

type AppShellProps = {
  children: React.ReactNode;
  email?: string;
};

export function AppShell({ children, email }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 pb-24 pt-6 sm:px-6 lg:pb-8">
      <header className="mb-6 flex items-center justify-between border-b-2 border-green-deep/10 pb-5">
        <BrandHeader />
        <div className="hidden items-center gap-4 sm:flex">
          {email ? <span className="text-sm text-muted">{email}</span> : null}
          <LogoutButton />
        </div>
      </header>

      <nav className="mb-8 hidden gap-1 lg:flex">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-green-muted",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-green-deep/10 bg-white px-2 py-2 lg:hidden">
        <ul className="mx-auto flex max-w-lg justify-between">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center rounded-xl px-2 py-1.5 text-[10px] font-semibold",
                    active ? "text-green-deep" : "text-muted",
                  )}
                >
                  <span
                    className={cn(
                      "mb-0.5 h-1 w-6 rounded-full",
                      active ? "bg-green-deep" : "bg-transparent",
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

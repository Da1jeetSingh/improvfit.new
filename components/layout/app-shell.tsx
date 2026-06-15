"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandHeader } from "@/components/brand/brand-header";
import { LogoutButton } from "@/components/auth/logout-button";
import { StreakBadge } from "@/components/streak/streak-badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/matches", label: "Match" },
  { href: "/training", label: "Training" },
  { href: "/stats", label: "Stats" },
  { href: "/goals", label: "Goals" },
  { href: "/weekly", label: "Weekly" },
  { href: "/milestones", label: "Awards" },
  { href: "/profile", label: "Profile" },
] as const;

type AppShellProps = {
  children: React.ReactNode;
  email?: string;
  currentStreak?: number;
};

export function AppShell({ children, email, currentStreak = 0 }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-raised/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandHeader />
            <StreakBadge count={currentStreak} className="hidden sm:inline-flex" />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm transition-colors duration-200",
                    active
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <StreakBadge count={currentStreak} className="sm:hidden" />
            {email ? (
              <span className="hidden rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-muted sm:inline">
                {email}
              </span>
            ) : null}
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6 lg:pb-10">
        <main className="flex-1 animate-fade-in-up">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-surface-raised/98 px-2 py-2 shadow-elevated backdrop-blur-md lg:hidden">
          <ul className="mx-auto flex max-w-lg justify-between gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-w-[3rem] flex-col items-center rounded-xl px-1.5 py-1.5 text-[9px] font-semibold transition-colors duration-200",
                      active ? "text-green-deep" : "text-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "mb-1 h-0.5 w-4 rounded-full transition-all duration-200",
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
    </div>
  );
}

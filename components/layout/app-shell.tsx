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
  { href: "/milestones", label: "Awards" },
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
    <div className="relative min-h-full bg-background">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-green-muted/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pt-8">
        <header className="mb-8 flex items-center justify-between">
          <BrandHeader />
          <div className="hidden items-center gap-4 sm:flex">
            {email ? (
              <span className="rounded-full bg-green-muted px-3 py-1 text-xs font-medium text-muted">
                {email}
              </span>
            ) : null}
            <LogoutButton />
          </div>
        </header>

        <nav className="mb-10 hidden flex-wrap gap-2 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                  active
                    ? "bg-green-deep text-white shadow-soft"
                    : "text-foreground hover:bg-green-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 animate-fade-in-up">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-white/90 px-1 py-2 shadow-elevated backdrop-blur-md lg:hidden">
          <ul className="mx-auto flex max-w-lg justify-between gap-0.5 overflow-x-auto">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-w-[3.25rem] flex-col items-center rounded-xl px-1.5 py-1.5 text-[9px] font-semibold transition-all duration-200",
                      active ? "text-green-deep" : "text-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "mb-1 h-1 w-5 rounded-full transition-all duration-200",
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

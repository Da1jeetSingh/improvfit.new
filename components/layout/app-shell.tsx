"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandHeader } from "@/components/brand/brand-header";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { HeaderStreak } from "@/components/layout/header-streak";
import { SettingsNavIcon } from "@/components/layout/nav-icons";
import { isNavItemActive } from "@/lib/navigation/app-nav";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  email?: string;
  currentStreak?: number;
};

export function AppShell({ children, email, currentStreak = 0 }: AppShellProps) {
  const pathname = usePathname();
  const settingsActive = isNavItemActive(pathname, "/settings");

  return (
    <div className="relative min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-raised/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <HeaderStreak count={currentStreak} />
          </div>

          <DesktopNav />

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <BrandHeader />
            {email ? (
              <span className="hidden rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-muted xl:inline">
                {email}
              </span>
            ) : null}
            <Link
              href="/settings"
              aria-current={settingsActive ? "page" : undefined}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface text-muted transition-colors duration-200",
                "hover:border-green-sage/30 hover:bg-green-tint/40 hover:text-foreground",
                settingsActive && "border-green-sage/35 bg-green-tint/50 text-green-deep",
              )}
              aria-label="Settings"
              title="Settings"
            >
              <SettingsNavIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 lg:pb-10">
        <main className="flex-1 animate-fade-in-up">{children}</main>
      </div>

      <BottomTabBar />
    </div>
  );
}

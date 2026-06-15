"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { BrandHeader } from "@/components/brand/brand-header";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { StreakBadge } from "@/components/streak/streak-badge";

type AppShellProps = {
  children: React.ReactNode;
  email?: string;
  currentStreak?: number;
};

export function AppShell({ children, email, currentStreak = 0 }: AppShellProps) {
  return (
    <div className="relative min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-raised/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandHeader />
            <StreakBadge count={currentStreak} className="hidden sm:inline-flex" />
          </div>

          <DesktopNav />

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <StreakBadge count={currentStreak} className="sm:hidden" />
            {email ? (
              <span className="hidden rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-muted xl:inline">
                {email}
              </span>
            ) : null}
            <LogoutButton />
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

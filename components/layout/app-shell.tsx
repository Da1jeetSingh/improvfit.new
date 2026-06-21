"use client";

import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { TitleBar } from "@/components/layout/title-bar";

type AppShellProps = {
  children: React.ReactNode;
  email?: string;
  currentStreak?: number;
};

export function AppShell({ children, email, currentStreak = 0 }: AppShellProps) {
  return (
    <div className="relative min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />

      <TitleBar currentStreak={currentStreak} />

      <div className="hidden border-b border-border-subtle bg-surface-raised/95 lg:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-2">
          <DesktopNav />
          {email ? (
            <span className="ml-auto hidden rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-muted xl:inline">
              {email}
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 lg:pb-10">
        <main className="flex-1 animate-fade-in-up">{children}</main>
      </div>

      <BottomTabBar />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { StreakBadge } from "@/components/streak/streak-badge";
import { SunNavIcon } from "@/components/layout/nav-icons";
import { isNavItemActive } from "@/lib/navigation/app-nav";
import { cn } from "@/lib/utils";

type TitleBarProps = {
  currentStreak?: number;
};

export function TitleBar({ currentStreak = 0 }: TitleBarProps) {
  const pathname = usePathname();
  const settingsActive = isNavItemActive(pathname, "/settings");

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center">
          <Link
            href="/dashboard"
            className="font-horizon text-[1.375rem] leading-none tracking-[0.03em] text-black uppercase"
          >
            IMPROV
          </Link>
          <StreakBadge count={currentStreak} className="ml-2.5 shrink-0" />
        </div>

        <Link
          href="/settings"
          aria-current={settingsActive ? "page" : undefined}
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#666666] transition-colors duration-200",
            settingsActive && "bg-[#e8e8e8] text-black",
          )}
          aria-label="Settings"
          title="Settings"
        >
          <SunNavIcon className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}

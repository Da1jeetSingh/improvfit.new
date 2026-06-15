"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavItemActive, primaryNavItems } from "@/lib/navigation/app-nav";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-surface-raised/98 shadow-elevated backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex w-full max-w-lg items-stretch justify-between gap-0.5 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {primaryNavItems.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;
          const label = item.shortLabel ?? item.label;

          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[3.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors duration-200",
                  active
                    ? "text-green-deep"
                    : "text-muted hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-200",
                    active ? "bg-green-tint text-green-deep" : "bg-transparent",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="truncate leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isNavItemActive,
  primaryNavItems,
  secondaryNavItems,
} from "@/lib/navigation/app-nav";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const pathname = usePathname();
  const items = [...primaryNavItems, ...secondaryNavItems];

  return (
    <nav
      aria-label="Main navigation"
      className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-6"
    >
      {items.map((item) => {
        const active = isNavItemActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
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
  );
}

import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type BrandHeaderProps = {
  className?: string;
  href?: string;
  size?: "default" | "large";
  showLogo?: boolean;
};

export function BrandHeader({
  className,
  href = "/dashboard",
  size = "default",
  showLogo = true,
}: BrandHeaderProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-foreground transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span
        className={cn(
          "font-horizon leading-none tracking-[0.02em]",
          size === "large" ? "text-[1.65rem]" : "text-[1.35rem]",
        )}
      >
        IMPROV
      </span>
      {showLogo ? (
        <Logo
          className={cn(
            "shrink-0 transition-transform duration-300 group-hover:scale-105",
            size === "large" ? "h-8 w-[4.5rem]" : "h-7 w-16",
          )}
        />
      ) : null}
    </Link>
  );
}

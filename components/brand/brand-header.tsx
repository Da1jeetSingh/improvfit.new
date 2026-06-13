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
        "group inline-flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-90",
        className,
      )}
    >
      {showLogo ? (
        <Logo
          className={cn(
            "transition-transform duration-300 group-hover:scale-105",
            size === "large" ? "h-9 w-9" : "h-8 w-8",
          )}
        />
      ) : null}
      <span
        className={cn(
          "font-bold uppercase tracking-tight",
          size === "large" ? "text-2xl" : "text-xl",
        )}
      >
        IMPROV
      </span>
    </Link>
  );
}

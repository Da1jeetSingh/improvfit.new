import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type BrandHeaderProps = {
  className?: string;
  href?: string;
  size?: "default" | "large";
};

export function BrandHeader({
  className,
  href = "/dashboard",
  size = "default",
}: BrandHeaderProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 text-foreground transition-opacity hover:opacity-90",
        className,
      )}
    >
      <Logo
        className={cn(
          "transition-transform duration-300 group-hover:scale-105",
          size === "large" ? "h-9 w-9" : "h-8 w-8",
        )}
      />
      <span
        className={cn(
          "font-bold tracking-tight",
          size === "large" ? "text-2xl" : "text-xl",
        )}
      >
        IMPROV
      </span>
    </Link>
  );
}

import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type BrandHeaderProps = {
  className?: string;
  href?: string;
};

export function BrandHeader({ className, href = "/dashboard" }: BrandHeaderProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 text-foreground", className)}
    >
      <span className="text-xl font-bold tracking-tight">Improv</span>
      <Logo className="h-7 w-7" />
    </Link>
  );
}

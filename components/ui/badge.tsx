import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "brand"
  | "section"
  | "eyebrow"
  | "success"
  | "muted"
  | "danger";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variants: Record<BadgeVariant, string> = {
  default: "bg-green-tint text-green-deep border border-green-muted",
  brand: "bg-green-deep text-white border border-green-deep",
  section: "bg-green-deep text-white border border-green-deep",
  eyebrow:
    "bg-surface text-muted border border-border-subtle normal-case tracking-normal font-medium",
  success: "bg-green-muted text-green-brand border border-green-soft/50",
  muted: "bg-surface text-muted border border-border-subtle",
  danger: "bg-red-50 text-red-700 border border-red-200/60",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "brand" | "success" | "muted" | "danger";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variants: Record<BadgeVariant, string> = {
  default: "bg-green-muted text-foreground",
  brand: "bg-green-deep text-white",
  success: "bg-green-soft/60 text-green-deep",
  muted: "bg-green-muted/60 text-muted",
  danger: "bg-red-50 text-red-700",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

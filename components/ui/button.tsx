import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-green-deep text-white shadow-soft hover:bg-green-brand hover:shadow-card active:scale-[0.98]",
  secondary:
    "bg-surface-raised text-foreground border border-border shadow-soft hover:border-green-sage/40 hover:bg-green-tint active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground-secondary hover:bg-green-tint hover:text-foreground border border-transparent",
  danger:
    "bg-surface-raised text-red-700 border border-red-200/80 hover:bg-red-50 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 ease-out",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

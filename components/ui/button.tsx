import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90 border border-foreground",
  secondary:
    "bg-white text-foreground border-2 border-green-deep hover:bg-green-muted",
  ghost: "bg-transparent text-foreground hover:bg-green-muted border border-transparent",
  danger:
    "bg-white text-red-700 border border-red-200 hover:bg-red-50",
};

export function Button({
  className,
  variant = "primary",
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

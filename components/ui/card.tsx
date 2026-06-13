import { cn } from "@/lib/utils";

type CardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = {
  sm: "p-5",
  md: "p-6 sm:p-7",
  lg: "p-7 sm:p-9",
};

export function Card({
  title,
  description,
  children,
  className,
  padding = "md",
}: CardProps) {
  return (
    <section
      className={cn(
        "ds-surface animate-fade-in-up",
        paddingMap[padding],
        className,
      )}
    >
      {title || description ? (
        <div className="mb-5 border-b border-border-subtle pb-4">
          {title ? (
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

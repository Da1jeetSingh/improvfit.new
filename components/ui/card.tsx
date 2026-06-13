import { cn } from "@/lib/utils";

type CardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = {
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
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
        "rounded-2xl border-2 border-green-deep/15 bg-white shadow-sm",
        paddingMap[padding],
        className,
      )}
    >
      {title || description ? (
        <div className="mb-4">
          {title ? (
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-muted">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

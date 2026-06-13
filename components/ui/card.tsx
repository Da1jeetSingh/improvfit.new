import { cn } from "@/lib/utils";

type CardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Card({ title, description, children, className }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      {title || description ? (
        <div className="mb-4">
          {title ? (
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

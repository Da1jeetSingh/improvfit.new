import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-10 space-y-3 animate-fade-in-up", className)}>
      {eyebrow ? <Badge variant="eyebrow">{eyebrow}</Badge> : null}
      <h1 className="text-3xl font-bold tracking-tight text-green-deep sm:text-4xl lg:text-[2.5rem] lg:leading-[1.12]">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {description}
      </p>
    </header>
  );
}

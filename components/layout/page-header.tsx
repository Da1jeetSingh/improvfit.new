import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-10 space-y-3 animate-fade-in-up">
      {eyebrow ? (
        <Badge variant="success" className="uppercase tracking-wider">
          {eyebrow}
        </Badge>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {description}
      </p>
    </header>
  );
}

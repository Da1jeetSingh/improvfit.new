type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8 space-y-2">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-green-deep">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-base text-muted">{description}</p>
    </header>
  );
}

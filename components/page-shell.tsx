import Link from "next/link";

type PageShellProps = {
  title: string;
  description: string;
  showBackLink?: boolean;
  children?: React.ReactNode;
};

export function PageShell({
  title,
  description,
  showBackLink = true,
  children,
}: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col px-6 py-16">
      {showBackLink ? (
        <Link
          href="/"
          className="mb-8 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to home
        </Link>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-zinc-600">{description}</p>
      {children}
    </main>
  );
}

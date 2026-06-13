import Link from "next/link";

type PageShellProps = {
  title: string;
  description: string;
};

export function PageShell({ title, description }: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col px-6 py-16">
      <Link
        href="/"
        className="mb-8 text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        ← Back to home
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg text-zinc-600">{description}</p>
    </main>
  );
}

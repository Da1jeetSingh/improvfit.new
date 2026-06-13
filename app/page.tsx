import Link from "next/link";

const navLinks = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign up" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/training", label: "Training" },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
        Cricket performance
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">IMPROV</h1>
      <p className="mt-4 text-lg text-zinc-600">
        Track your player profile and training sessions. Built for individual
        players.
      </p>

      <nav className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Pages
        </h2>
        <ul className="mt-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

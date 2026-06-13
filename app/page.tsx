import Link from "next/link";

import { BrandHeader } from "@/components/brand/brand-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-full flex-col items-center justify-center px-6 py-20 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--green-muted)_0%,_transparent_60%)]"
        aria-hidden
      />

      <div className="relative animate-fade-in-up">
        <BrandHeader href="/" size="large" className="mb-8 justify-center" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your cricket performance, elevated.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          Player-only performance tracking. Train smarter, play better, and watch
          your progress unfold.
        </p>
        <div className="mt-12 flex w-full max-w-xs flex-col gap-3 sm:mx-auto">
          <Link href="/login">
            <Button fullWidth size="lg">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button fullWidth size="lg" variant="secondary">
              Create account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";

import { BrandHeader } from "@/components/brand/brand-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <BrandHeader href="/" className="mb-6" />
      <p className="text-lg text-muted">
        Player-only cricket performance tracking. Clean, focused, and built to
        grow with you.
      </p>
      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        <Link href="/login">
          <Button fullWidth>Log in</Button>
        </Link>
        <Link href="/login?tab=signup">
          <Button fullWidth variant="secondary">
            Create account
          </Button>
        </Link>
      </div>
    </main>
  );
}

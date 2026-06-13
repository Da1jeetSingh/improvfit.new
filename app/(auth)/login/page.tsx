import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { PageShell } from "@/components/page-shell";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next ?? "/dashboard";

  return (
    <PageShell
      title="Login"
      description="Sign in to your IMPROV account."
    >
      {params.error === "auth_callback_failed" ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          Sign-in could not be completed. Please try again.
        </p>
      ) : null}

      <LoginForm next={next} />

      <p className="mt-6 text-sm text-zinc-600">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-emerald-700 hover:underline">
          Sign up
        </Link>
      </p>
    </PageShell>
  );
}

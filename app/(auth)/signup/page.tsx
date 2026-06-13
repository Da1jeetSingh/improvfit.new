import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";
import { PageShell } from "@/components/page-shell";

export default function SignupPage() {
  return (
    <PageShell
      title="Sign up"
      description="Create your IMPROV account."
    >
      <SignupForm />

      <p className="mt-6 text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          Sign in
        </Link>
      </p>
    </PageShell>
  );
}

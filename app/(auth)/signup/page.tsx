import { redirect } from "next/navigation";

import { AuthShell } from "@/components/layout/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getSession } from "@/lib/auth";

export default async function SignupPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      description="Start tracking your cricket performance."
    >
      <SignupForm />
    </AuthShell>
  );
}

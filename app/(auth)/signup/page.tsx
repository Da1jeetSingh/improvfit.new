import { AuthShell } from "@/components/layout/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start tracking your cricket performance."
    >
      <SignupForm />
    </AuthShell>
  );
}

import { AuthShell } from "@/components/layout/auth-shell";
import { DemoSignupForm } from "@/components/video-demo/demo-signup-form";

export default function VideoDemoSignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start tracking your cricket performance."
    >
      <DemoSignupForm />
    </AuthShell>
  );
}

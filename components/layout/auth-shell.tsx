import { BrandHeader } from "@/components/brand/brand-header";
import { Card } from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center bg-background px-4 py-16">
      <div className="ds-ambient" aria-hidden />

      <div className="relative mb-10 animate-fade-in-up">
        <BrandHeader href="/" size="large" />
      </div>

      <Card className="relative w-full max-w-md animate-fade-in-up animate-delay-1" padding="lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        </div>
        {children}
      </Card>
    </div>
  );
}

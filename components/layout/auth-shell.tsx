import { BrandHeader } from "@/components/brand/brand-header";
import { Card } from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <BrandHeader href="/" />
      </div>

      <Card className="w-full max-w-md" padding="lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted">{description}</p>
        </div>
        {children}
      </Card>
    </div>
  );
}

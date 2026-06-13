import { BrandHeader } from "@/components/brand/brand-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />
      <header className="border-b border-border-subtle bg-surface-raised">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandHeader href="/" size="large" showLogo={false} />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-2xl" />
            <Skeleton className="h-9 w-20 rounded-2xl" />
          </div>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="h-16 w-64" />
          <Skeleton className="h-20 w-full max-w-lg" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-44 rounded-2xl" />
            <Skeleton className="h-12 w-36 rounded-2xl" />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </main>
    </div>
  );
}

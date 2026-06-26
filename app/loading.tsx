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
            <Skeleton className="h-9 w-32 rounded-2xl" />
          </div>
        </div>
      </header>
      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 rounded-full" />
            <Skeleton className="h-14 w-full max-w-lg" />
            <Skeleton className="h-20 w-full max-w-md" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 w-44 rounded-2xl" />
              <Skeleton className="h-12 w-40 rounded-2xl" />
            </div>
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </section>
        <section className="border-y border-border-subtle bg-surface-raised">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-none" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

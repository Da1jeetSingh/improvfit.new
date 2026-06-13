import { BrandHeader } from "@/components/brand/brand-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <BrandHeader href="/" size="large" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-28" />
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Skeleton className="mx-auto h-4 w-56" />
          <Skeleton className="mx-auto h-14 w-full max-w-xl" />
          <Skeleton className="mx-auto h-20 w-full max-w-lg" />
          <div className="flex justify-center gap-3 pt-4">
            <Skeleton className="h-12 w-44" />
            <Skeleton className="h-12 w-44" />
          </div>
        </div>
      </main>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <section className="space-y-8">
      <div className="space-y-3 border-b border-border-subtle pb-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
    </section>
  );
}

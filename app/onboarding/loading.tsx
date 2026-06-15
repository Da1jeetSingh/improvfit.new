import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-16">
      <Skeleton className="mx-auto mb-10 h-8 w-32" />
      <Skeleton className="mb-4 h-2 w-full rounded-full" />
      <Skeleton className="mb-8 h-10 w-3/4" />
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
}

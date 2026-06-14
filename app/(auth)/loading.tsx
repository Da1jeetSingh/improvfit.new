import { PageSkeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <PageSkeleton />
    </div>
  );
}

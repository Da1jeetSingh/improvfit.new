import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  className?: string;
};

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm",
        "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-emerald-500 before:to-emerald-700",
        className,
      )}
    >
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-zinc-400">{hint}</p> : null}
    </div>
  );
}

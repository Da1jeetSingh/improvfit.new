import { ChartLine } from "@/components/ui/chart-line";
import { cn } from "@/lib/utils";
import type { SaveInsight } from "@/lib/stats/save-insights";

type SaveInsightCardProps = {
  insight: SaveInsight;
  className?: string;
  compact?: boolean;
};

export function SaveInsightCard({
  insight,
  className,
  compact = false,
}: SaveInsightCardProps) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-border-subtle bg-surface-raised px-4 py-4 shadow-soft",
        className,
      )}
      aria-live="polite"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
        {insight.title}
      </p>
      <p
        className={cn(
          "mt-2 font-medium leading-relaxed text-foreground",
          compact ? "text-sm" : "text-base",
        )}
      >
        {insight.detail}
      </p>

      {insight.chartData && insight.chartData.length > 1 ? (
        <div className="mt-3">
          <ChartLine
            series={[
              {
                id: "scores",
                data: insight.chartData,
                color: "var(--green-deep)",
                fill: "var(--green-tint)",
                fillOpacity: 0.35,
                showFill: true,
                showDots: true,
              },
              ...(insight.chartSecondary
                ? [
                    {
                      id: "rolling",
                      data: insight.chartSecondary,
                      color: "var(--green-sage)",
                      dashed: true,
                      showFill: false,
                      showDots: false,
                      strokeWidth: 2,
                    },
                  ]
                : []),
            ]}
            className="h-32"
            aria-label="Updated batting form preview"
          />
        </div>
      ) : null}
    </aside>
  );
}

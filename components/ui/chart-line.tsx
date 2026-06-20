import { cn } from "@/lib/utils";

export type ChartPoint = {
  label: string;
  value: number;
};

type ChartLineProps = {
  data: ChartPoint[];
  className?: string;
  "aria-label"?: string;
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;
const PADDING = { top: 16, right: 12, bottom: 28, left: 12 };

function buildLinePath(
  points: Array<{ x: number; y: number }>,
) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

export function ChartLine({ data, className, "aria-label": ariaLabel }: ChartLineProps) {
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const max = Math.max(...data.map((point) => point.value), 1);
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : 0;

  const points = data.map((point, index) => ({
    x: PADDING.left + stepX * index,
    y:
      PADDING.top +
      plotHeight -
      (point.value / max) * plotHeight,
  }));

  const baselineY = PADDING.top + plotHeight;
  const linePath = buildLinePath(points);

  return (
    <figure
      className={cn(
        "rounded-2xl border border-border-subtle bg-surface p-3 sm:p-4",
        className,
      )}
      aria-label={ariaLabel}
    >
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-40 w-full"
        role="img"
        aria-hidden={Boolean(ariaLabel)}
      >
        <line
          x1={PADDING.left}
          y1={baselineY}
          x2={CHART_WIDTH - PADDING.right}
          y2={baselineY}
          stroke="var(--border-subtle)"
          strokeWidth="1"
        />

        {linePath ? (
          <>
            <path
              d={`${linePath} L ${points.at(-1)?.x ?? PADDING.left} ${baselineY} L ${points[0]?.x ?? PADDING.left} ${baselineY} Z`}
              fill="var(--green-tint)"
              opacity="0.55"
            />
            <path
              d={linePath}
              fill="none"
              stroke="var(--green-deep)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point, index) => (
              <circle
                key={data[index]?.label ?? index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="var(--surface-raised)"
                stroke="var(--green-deep)"
                strokeWidth="2"
              />
            ))}
          </>
        ) : null}

        {data.map((point, index) => (
          <text
            key={point.label}
            x={PADDING.left + stepX * index}
            y={CHART_HEIGHT - 8}
            textAnchor="middle"
            className="fill-muted text-[10px] font-semibold uppercase tracking-wide"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </figure>
  );
}
